// HW4 Part 2 - Dynamic Multiplication Table with jQuery Validation + jQuery UI
// Author: Mohith Sai Gadde (02209215)
// Email: MohithSai_Gadde@student.uml.edu

(function () {
  const LIMIT_MIN = -50;
  const LIMIT_MAX = 50;
  const MAX_CELLS = 10000;

  const $form = $("#tableForm");
  const $previewShell = $("#previewShell");
  const $msg = $("#messages");

  const $tabs = $("#tabs");
  const $tabsList = $("#tabs-list");
  const $multiDeleteList = $("#multiDeleteList");
  const $btnDeleteSelected = $("#btnDeleteSelected");

  let tabCounter = 0;

  function createTableElement(hStart, hEnd, vStart, vEnd) {
    const table = document.createElement("table");

    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    const corner = document.createElement("th");
    corner.className = "corner";
    corner.textContent = "×";
    trHead.appendChild(corner);

    for (let x = hStart; x <= hEnd; x++) {
      const th = document.createElement("th");
      th.textContent = x;
      trHead.appendChild(th);
    }
    thead.appendChild(trHead);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    for (let y = vStart; y <= vEnd; y++) {
      const tr = document.createElement("tr");

      const th = document.createElement("th");
      th.textContent = y;
      tr.appendChild(th);

      for (let x = hStart; x <= hEnd; x++) {
        const td = document.createElement("td");
        td.textContent = x * y;
        tr.appendChild(td);
      }

      tbody.appendChild(tr);
    }
    table.appendChild(tbody);

    return table;
  }

  function updatePreviewIfValid() {
    if (!$form.valid()) {
      $previewShell.empty();
      $msg.addClass("error").text("Please fix the highlighted errors to see the table preview.");
      return;
    }

    $msg.removeClass("error").text("");

    const hStart = parseInt($("#hStart").val(), 10);
    const hEnd = parseInt($("#hEnd").val(), 10);
    const vStart = parseInt($("#vStart").val(), 10);
    const vEnd = parseInt($("#vEnd").val(), 10);

    const table = createTableElement(hStart, hEnd, vStart, vEnd);
    $previewShell.empty().append(table);
  }

  $.validator.addMethod(
    "horizRange",
    function (value, element) {
      const start = parseInt($("#hStart").val(), 10);
      const end = parseInt($("#hEnd").val(), 10);
      if (isNaN(start) || isNaN(end)) {
        return true;
      }
      return start <= end;
    },
    "Horizontal start must be less than or equal to horizontal end."
  );

  $.validator.addMethod(
    "vertRange",
    function (value, element) {
      const start = parseInt($("#vStart").val(), 10);
      const end = parseInt($("#vEnd").val(), 10);
      if (isNaN(start) || isNaN(end)) {
        return true;
      }
      return start <= end;
    },
    "Vertical start must be less than or equal to vertical end."
  );

  $.validator.addMethod(
    "maxCells",
    function () {
      const hStart = parseInt($("#hStart").val(), 10);
      const hEnd = parseInt($("#hEnd").val(), 10);
      const vStart = parseInt($("#vStart").val(), 10);
      const vEnd = parseInt($("#vEnd").val(), 10);

      if ([hStart, hEnd, vStart, vEnd].some(isNaN)) {
        return true;
      }

      const width = Math.abs(hEnd - hStart) + 1;
      const height = Math.abs(vEnd - vStart) + 1;
      const cells = width * height;

      return cells <= MAX_CELLS;
    },
    "Table is too large. Please choose a smaller range (maximum 10,000 cells)."
  );

  $form.validate({
    errorPlacement: function (error, element) {
      error.insertAfter(element);
    },
    highlight: function (element) {
      $(element).addClass("error");
    },
    unhighlight: function (element) {
      $(element).removeClass("error");
    },
    rules: {
      hStart: {
        required: true,
        number: true,
        range: [LIMIT_MIN, LIMIT_MAX]
      },
      hEnd: {
        required: true,
        number: true,
        range: [LIMIT_MIN, LIMIT_MAX],
        horizRange: true,
        maxCells: true
      },
      vStart: {
        required: true,
        number: true,
        range: [LIMIT_MIN, LIMIT_MAX]
      },
      vEnd: {
        required: true,
        number: true,
        range: [LIMIT_MIN, LIMIT_MAX],
        vertRange: true,
        maxCells: true
      }
    },
    messages: {
      hStart: {
        required: "Please enter a horizontal start value.",
        number: "Horizontal start must be an integer.",
        range: `Horizontal start must be between ${LIMIT_MIN} and ${LIMIT_MAX}.`
      },
      hEnd: {
        required: "Please enter a horizontal end value.",
        number: "Horizontal end must be an integer.",
        range: `Horizontal end must be between ${LIMIT_MIN} and ${LIMIT_MAX}.`
      },
      vStart: {
        required: "Please enter a vertical start value.",
        number: "Vertical start must be an integer.",
        range: `Vertical start must be between ${LIMIT_MIN} and ${LIMIT_MAX}.`
      },
      vEnd: {
        required: "Please enter a vertical end value.",
        number: "Vertical end must be an integer.",
        range: `Vertical end must be between ${LIMIT_MIN} and ${LIMIT_MAX}.`
      }
    },
    submitHandler: function () {
      $msg.removeClass("error").text("");

      const hStart = parseInt($("#hStart").val(), 10);
      const hEnd = parseInt($("#hEnd").val(), 10);
      const vStart = parseInt($("#vStart").val(), 10);
      const vEnd = parseInt($("#vEnd").val(), 10);

      const table = createTableElement(hStart, hEnd, vStart, vEnd);

      addTableTab(
        {
          hStart,
          hEnd,
          vStart,
          vEnd
        },
        table
      );

      updatePreviewIfValid();

      return false;
    }
  });

  $tabs.tabs();

  $tabs.on("click", "span.ui-icon-close", function () {
    const $li = $(this).closest("li");
    const tabId = $li.attr("data-tab-id");
    if (!tabId) return;

    $("#" + tabId).remove();
    $li.remove();

    $tabs.tabs("refresh");
    updateMultiDeleteList();
  });

  function addTableTab(params, tableElement) {
    tabCounter += 1;
    const tabId = "tab-" + tabCounter;

    const label = `H:[${params.hStart},${params.hEnd}] V:[${params.vStart},${params.vEnd}]`;

    const $li = $(`
      <li data-tab-id="${tabId}">
        <a href="#${tabId}">${label}</a>
        <span class="ui-icon ui-icon-close" role="presentation">Remove Tab</span>
      </li>
    `);

    $tabsList.append($li);

    const $panel = $(`<div id="${tabId}" class="table-tab"></div>`);
    $panel.append(tableElement);
    $tabs.append($panel);

    $tabs.tabs("refresh");
    const index = $("#tabs li").length - 1;
    $tabs.tabs("option", "active", index);

    updateMultiDeleteList();
  }

  function updateMultiDeleteList() {
    $multiDeleteList.empty();

    const $lis = $tabsList.find("li").not(":first");

    if ($lis.length === 0) {
      $multiDeleteList.append('<p class="note small">No saved tables yet.</p>');
      return;
    }

    $lis.each(function () {
      const $li = $(this);
      const tabId = $li.attr("data-tab-id");
      const text = $li.find("a").text();

      const $item = $(`
        <label class="multi-item">
          <input type="checkbox" class="multi-delete-checkbox" data-tab-id="${tabId}" />
          ${text}
        </label>
      `);
      $multiDeleteList.append($item);
    });
  }

  $btnDeleteSelected.on("click", function () {
    const tabIds = [];
    $(".multi-delete-checkbox:checked").each(function () {
      const id = $(this).data("tabId");
      if (id) tabIds.push(id);
    });

    if (!tabIds.length) {
      return;
    }

    tabIds.forEach(function (tabId) {
      $tabsList.find(`li[data-tab-id="${tabId}"]`).remove();
      $("#" + tabId).remove();
    });

    $tabs.tabs("refresh");
    updateMultiDeleteList();
  });

  function initSlider(inputId, sliderId) {
    const $input = $("#" + inputId);
    const $slider = $("#" + sliderId);

    let initial = parseInt($input.val(), 10);
    if (isNaN(initial)) initial = 0;
    if (initial < LIMIT_MIN) initial = LIMIT_MIN;
    if (initial > LIMIT_MAX) initial = LIMIT_MAX;

    $slider.slider({
      min: LIMIT_MIN,
      max: LIMIT_MAX,
      value: initial,
      slide: function (event, ui) {
        $input.val(ui.value);
        updatePreviewIfValid();
      },
      change: function (event, ui) {
        $input.val(ui.value);
        updatePreviewIfValid();
      }
    });

    $input.on("input", function () {
      let val = parseInt($input.val(), 10);

      if (isNaN(val)) {
        updatePreviewIfValid();
        return;
      }

      if (val < LIMIT_MIN) val = LIMIT_MIN;
      if (val > LIMIT_MAX) val = LIMIT_MAX;

      if ($slider.slider("value") !== val) {
        $slider.slider("value", val);
      } else {
        updatePreviewIfValid();
      }
    });
  }

  initSlider("hStart", "hStartSlider");
  initSlider("hEnd", "hEndSlider");
  initSlider("vStart", "vStartSlider");
  initSlider("vEnd", "vEndSlider");

  $("#hStart, #hEnd, #vStart, #vEnd").on("blur", function () {
    updatePreviewIfValid();
  });

  $("#resetBtn").on("click", function () {
    $form[0].reset();

    $("#hStartSlider").slider("value", parseInt($("#hStart").val(), 10) || 1);
    $("#hEndSlider").slider("value", parseInt($("#hEnd").val(), 10) || 5);
    $("#vStartSlider").slider("value", parseInt($("#vStart").val(), 10) || 5);
    $("#vEndSlider").slider("value", parseInt($("#vEnd").val(), 10) || 8);

    $previewShell.empty();
    $msg.removeClass("error").text("Cleared.");

    $form.validate().resetForm();
    $form.find(".error").removeClass("error");
  });

  updatePreviewIfValid();
})();
