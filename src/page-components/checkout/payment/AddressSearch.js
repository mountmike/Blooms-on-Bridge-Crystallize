import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import styles from './delivery.module.css'
import Autocomplete from "react-google-autocomplete";


export default function AddressSearch({ setAddress }) {


  const handleAddressSelection = (place) => {
    if (place === undefined) {
      return
    }
    let formattedAddress = {
      unitNumber: '',
      streetNumber: place[0].long_name,
      streetName: place[1].long_name,
      suburb: place[2].long_name,
      territory: place[4].long_name,
      postcode: place[6].long_name
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