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


/* ***************************
 *  Intentional 500 error trigger
 * ************************** */
invCont.triggerError = async function (req, res, next) {
  // Throw an intentional error to test the error middleware
  throw new Error("Intentional 500 error triggered for testing.")
}


module.exports = invCont