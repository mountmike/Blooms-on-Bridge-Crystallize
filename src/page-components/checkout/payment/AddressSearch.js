import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import styles from './delivery.module.css'
import Autocomplete from "react-google-autocomplete";


export default function AddressSearch({ setAddress }) {


  const handleAddressSelection = (place) => {
    if (place === undefined) {
      return
    }

    place = Object.assign({}, ...place.map(index => {
      return { [index.types[0]]: index.long_name }
    }))

    let formattedAddress = {
      unitNumber: place.subpremise ? place.subpremise : "",
      streetNumber: place.street_number,
      streetName: place.route,
      suburb: place.locality,
      territory: place.administrative_area_level_1,
      postcode: place.postal_code,
    }
    setAddress(formattedAddress)
  }

  return (
    <>
      <Autocomplete
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