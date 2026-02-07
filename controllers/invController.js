const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)

  let nav = await utilities.getNav()

  let className = "Vehicles"
  if (data.length > 0) {
    className = data[0].classification_name
  }

  const grid = await utilities.buildClassificationGrid(data)

  res.render("inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}


invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const inv_id = req.params.invId
    const vehicle = await invModel.getInventoryById(inv_id)

    if (!vehicle) {
      return next({ status: 404, message: "Sorry, we couldn't find that vehicle." })
    }

    let nav = await utilities.getNav()
    const vehicleHTML = utilities.buildVehicleDetail(vehicle)

    res.render("inventory/details", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicleHTML,
    })
  } catch (error) {
    next(error)
  }
}


invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Add new classification
 * ************************** */


invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body

  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", `Successfully added classification: ${classification_name}.`)
    let nav = await utilities.getNav()
    return res.render("inventory/management", {
      title: "Inventory Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the classification could not be added.")
    let nav = await utilities.getNav()
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      classification_name,
    })
  }
}


/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
  })
}

/* ***************************
 *  Add new inventory item
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body

  const result = await invModel.addInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  )

  if (result) {
    req.flash("notice", `Successfully added ${inv_make} ${inv_model}.`)
    let nav = await utilities.getNav()
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the inventory item could not be added.")
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)

    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: null,
      classificationList,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    })
  }
}
/* ***************************
 *  Intentional 500 error trigger
 * ************************** */
invCont.triggerError = async function (req, res, next) {
  // Throw an intentional error to test the error middleware
  throw new Error("Intentional 500 error triggered for testing.")
}


module.exports = invCont