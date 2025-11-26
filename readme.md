## Dynamic Multiplication Table – HW4 Part 2

## Overview

This project creates a fully interactive Dynamic Multiplication Table using **HTML**, **CSS**, **jQuery**, **jQuery Validation**, and **jQuery UI**.
Users can enter integer ranges, use sliders to adjust values, preview the table live, and save multiple tables into tabs.

---

## Files Included

### **index.html**

Main structure of the application containing:

* Form inputs (hStart, hEnd, vStart, vEnd)
* jQuery UI sliders
* Live preview container
* Tabs for saved tables
* Multi-delete interface


### **style.css**

Defines all UI styling including:

* Layout and spacing
* Buttons and actions
* Sliders
* Error messages
* Saved tabs list
* Multiplication table formatting


### **script.js**

Controls all interactivity, including:

* jQuery Validation rules
* Two-way binding between sliders and inputs
* Live table preview
* Dynamic tab creation and deletion
* Bulk delete system
* Table generation logic


---

## Features

### Dynamic Table Generation

The multiplication table updates automatically when inputs or sliders change.

### Two-Way Binding

Changing a slider updates the textbox, and typing in the textbox updates the slider.

### jQuery Validation

Custom rules enforce:

* Valid integer inputs
* Range −50 to 50
* Start ≤ end
* Maximum 10,000 table cells

### Saving Tables

Tables can be saved into new tabs.
Each tab includes a built-in close button to remove it.

### Multi-Delete System

Allows selecting and deleting multiple saved tables at once.

### Reset Function

Clears form fields, resets sliders, removes errors, and clears the preview.

---

## How to Run

1. Place the three files in the same folder:

   * index.html
   * style.css
   * script.js
2. Open **index.html** in any modern browser (Chrome recommended).
   No additional setup is required.

---

## Author

Name: Mohith Sai Gadde
Student ID:02209215
Email: [MohithSai_Gadde@student.uml.edu]

## LINK:
## GitHub Repository: 
## GitHub Pages (Live Demo): 

