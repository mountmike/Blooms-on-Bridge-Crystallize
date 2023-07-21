import React, { useEffect, useState } from 'react'
import styles from './address.module.css'
import Autocomplete from "react-google-autocomplete";


export default function AddressSearch({ customer, setCustomer }) {


  const handleAddressSelection = (place) => {
    if (place === undefined) {
      return
    }

    place = Object.assign({}, ...place.map(index => {
      return { [index.types[0]]: index.long_name }
    }))

    const newCustomer = {...customer}
    const address = newCustomer.addresses[0]

    address.unitNumber = place.subpremise ? place.subpremise : ""
    address.streetNumber = place.street_number
    address.streetName = place.route
    address.suburb = place.locality
    address.territory = place.administrative_area_level_1
    address.postcode = place.postal_code

    setCustomer(newCustomer)
  }

  return (
    <>
      <Autocomplete
        id='addressSearch'
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        className={styles.addressInput}
        onPlaceSelected={(place) => {
          handleAddressSelection(place.address_components)
        }}
        options={{
          types: ["street_address"],
          componentRestrictions: { country: "au" },
        }}
      />
    </>
  )
}