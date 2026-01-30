const invModel = require("../models/inventory-model")
const Util = {}


/* **************************************
 * Build the navigation bar
 * ************************************ */

Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = '<ul class="nav-list">'
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="/inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="/inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the inventory detail view HTML
* ************************************ */

Util.buildVehicleDetail = function (vehicle) {
  const price = new Intl.NumberFormat('en-US').format(vehicle.inv_price)
  const miles = new Intl.NumberFormat('en-US').format(vehicle.inv_miles)

  let detail = '<section class="inv-detail">'
  detail += '  <div class="inv-detail__img">'
  detail += `    <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">`
  detail += '  </div>'

  detail += '  <div class="inv-detail__info">'
  detail += `    <h2 class="inv-detail__title">${vehicle.inv_make} ${vehicle.inv_model} Details</h2>`
  detail += '    <div class="inv-detail__panel">'
  detail += `      <p class="inv-detail__row"><strong>Price:</strong> $${price}</p>`
  detail += `      <p class="inv-detail__row"><strong>Description:</strong> ${vehicle.inv_description}</p>`
  detail += `      <p class="inv-detail__row"><strong>Color:</strong> ${vehicle.inv_color}</p>`
  detail += `      <p class="inv-detail__row"><strong>Miles:</strong> ${miles}</p>`
  detail += '    </div>'
  detail += '  </div>'
  detail += '</section>'

  return detail
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util