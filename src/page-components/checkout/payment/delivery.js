import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { getAddresses } from './delivery-utils'

const Wrapper = styled.div`
  display: flex;
  width: 100%
`;

export const Input = styled.input`
  background: var(--color-main-background);
  border-bottom: 1px solid var(--color-box-background);
  border: none;
  color: var(--color-text-sub);
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  padding: 15px 15px;
  transition: border 0.2s ease-in-out;
  width: 100%;

  &::placeholder {
    font-size: 12px;
    opacity: 0.5;
    padding-left: 10px;
  }

  &:valid {
    border-bottom: 1px solid #b7e2e4;
  }

  &:invalid {
    border-bottom: 1px solid var(--color-error);
  }

  &[value=''] {
    border-bottom: 1px solid var(--color-box-background);
  }
`;

export default function Delivery() {
    const [addressrArr, setAddressrArr] = useState([])


    const checkAddress = async (address) => {
        // setValue(address)
        if (address.length > 10) {
        let res = await getAddresses(address)
        setAddressrArr(res.map(el => el.sla))
        }
    }


  
  const [active, setActive] = useState(0);
  const [filtered, setFiltered] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [input, setInput] = useState("");
  
  const onChange = e => {
    const suggestions = addressrArr;
    const input = e.currentTarget.value;
    checkAddress(input)
    setActive(0);
    // setFiltered(newFilteredSuggestions);
    setIsShow(true);
    setInput(e.currentTarget.value)
    console.log(addressrArr);
  };
const onClick = e => {
    setActive(0);
    setFiltered([]);
    setIsShow(false);
    setInput(e.currentTarget.innerText)
  };
const onKeyDown = e => {
    if (e.keyCode === 13) { // enter key
      setActive(0);
      setIsShow(false);
      setInput(filtered[active])
    }
    else if (e.keyCode === 38) { // up arrow
      return (active === 0) ? null : setActive(active - 1);
    }
    else if (e.keyCode === 40) { // down arrow
      return (active - 1 === filtered.length) ? null : setActive(active + 1);
    }
  };
const renderAutocomplete = () => {
    if (isShow && input) {
      if (addressrArr.length) {
        return (
          <ul className="autocomplete">
            {addressrArr.map((suggestion, index) => {
              let className;
              if (index === active) {
                className = "active";
              }
              return (
                <li className={className} key={suggestion} onClick={onClick}>
                  {suggestion}
                </li>
              );
            })}
          </ul>
        );
      } else {
        return (
          <div className="no-autocomplete">
            <em>Not found</em>
          </div>
        );
      }
    }
    return <></>;
  }
return (
    <Wrapper>
      <Input
        type="text"
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={input}
      />
      {renderAutocomplete()}
    </Wrapper>
  );






  //   const [addressrArr, setAddressrArr] = useState([])
  //   const [value, setValue] = useState('');
  //   const [items, setItems] = useState([]);

  //   const search = (event) => {
  //       setItems([...Array(10).keys()].map(item => event.query + '-' + item));
  //   }


  //   const checkAddress = async (address) => {
  //       setValue(address)
  //       if (address.length > 10) {
  //       let res = await getAddresses(address)
  //       setAddressrArr(res.map(el => el.sla))
  //       }
  //   }

  // return (
  //   <Wrapper>
  //       {/* <AutoComplete 
  //           value={value} 
  //           suggestions={addressrArr} 
  //           completeMethod={search}  
  //           onChange={(e) => checkAddress(e.target.value)}
  //           className={styles.addressInput}
  //       /> */}
  //   </Wrapper>
    
  // )
}
