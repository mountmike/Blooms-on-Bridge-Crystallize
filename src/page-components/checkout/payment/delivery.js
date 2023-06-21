import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { getAddresses } from './delivery-utils'
import { AutoComplete } from "primereact/autocomplete";
import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";
import styles from './delivery.module.css'


const Wrapper = styled.div`
  display: flex;
  width: 100%
`;

export default function Delivery() {
    const [addressrArr, setAddressrArr] = useState([])
    const [value, setValue] = useState('');
    const [items, setItems] = useState([]);

    const search = (event) => {
        setItems([...Array(10).keys()].map(item => event.query + '-' + item));
    }


    const checkAddress = async (address) => {
        setValue(address)
        if (address.length > 10) {
        let res = await getAddresses(address)
        setAddressrArr(res.map(el => el.sla))
        }
    }

  return (
    <Wrapper >
        <AutoComplete 
            value={value} 
            suggestions={addressrArr} 
            completeMethod={search}  
            onChange={(e) => checkAddress(e.target.value)}
            className={styles.addressInput}
        />
    </Wrapper>
    
  )
}
