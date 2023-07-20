import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons"

import { format, getDay, add } from 'date-fns'
import { enGB } from 'date-fns/locale'
import { DatePickerCalendar } from 'react-nice-dates'
import 'react-nice-dates/build/style.css'
import { useEffect, useState } from 'react';

const listOfDeliveryPostcodes = ["3677", "3669", "3666", "3630"];

const calendarModifiers = {
    disabled: date => getDay(date) === 0, // Disables Sunday
    highlight: date => getDay(date) === 2 // Highlights Tuesdays
}

const tomorrow = add(new Date(), {
    days: 1,
  });


export default function Delivery({ postcode, deliveryMethod, setDeliveryMethod, isReadyForStripe, setDeliveryAddress }) {
    const [date, setDate] = useState()

    useEffect(() => {
        setDeliveryAddress((deliveryAddress) => {
            return { ...deliveryAddress, deliveryDate: date }
        })
    }, [date])

    const handleDeliverySelection = (e) => {
        setDeliveryMethod(e.target.value)
    }
 
    const isInTown = () => {
        return postcode == "3672" ? true : false
    }

    const isOutsideTown = () => {
        return listOfDeliveryPostcodes.includes(postcode) ? true : false
    }

    const Row = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    background: white;
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    padding: 15px 15px;
    `;

    const Wrapper = styled.div`
        padding-right: 15px;
        margin-bottom: 15px;
    `;

    const Label = styled.label`
    font-size: 1rem;
    `

    const DateHeading = styled.span`
    display: flex;
    justify-content: center;
    gap: 10px;
    font-size: 1rem;
        @media only screen and (max-width: 768px) {
        margin: 0 10px;
        }
    `

    const Radio = styled.input`
    width: 1.4rem;
    height: 1.4rem;
    `

    const DateWrapper = styled.div`
        display: flex;
        flex-direction: column;
        text-align: center;
        width: 100%;
        margin: 30px 0;
        gap: 10px;
    `

    if (!postcode) {
        return (
            <Wrapper>
                <span>Please enter a valid address to calculate delivery</span>
            </Wrapper>
        )
    } else {
        return (
        <Wrapper onChange={handleDeliverySelection}>
            <Row>
                <FontAwesomeIcon icon={faCircleInfo} width={20} height={20} />
                <Label htmlFor="collect">Collect in store - <b>FREE</b></Label>
                <Radio 
                type="radio" 
                id='collect' 
                name='deliverySelection' 
                value='collect'
                checked={deliveryMethod == 'collect'}
                readOnly
                disabled={isReadyForStripe}
                />
            </Row>

            {isInTown() &&
            <Row>
                <FontAwesomeIcon icon={faCircleInfo} width={20} height={20} />
                <Label htmlFor="deliveryInTown">Delivery in Benalla - <b>$10</b></Label>
                <Radio 
                type="radio" 
                id='deliveryInTown' 
                name='deliverySelection' 
                value='deliveryInTown'
                checked={deliveryMethod == 'deliveryInTown'}
                readOnly
                disabled={isReadyForStripe}
                />
            </Row>
            }
            {isOutsideTown() &&
            <Row>
                <FontAwesomeIcon icon={faCircleInfo} width={20} height={20} />
                <Label htmlFor="deliveryOutsideTown">
                Delivery outside of Benalla - <b>$20</b>
                </Label>
                <Radio 
                type="radio" 
                id='deliveryOutsideTown' 
                name='deliverySelection' 
                value='deliveryOutsideTown' 
                checked={deliveryMethod == 'deliveryOutsideTown' }
                readOnly
                disabled={isReadyForStripe}
                />
            </Row>
            }
            
            <DateWrapper>
                <DateHeading>
                    <FontAwesomeIcon icon={faCircleInfo} width={15} height={15} />
                    <b> Request Delivery Date:</b> {date ? format(date, 'dd MMM yyyy', { locale: enGB }) : 'none'}
                </DateHeading>
                <DatePickerCalendar 
                    date={date} 
                    onDateChange={setDate} 
                    locale={enGB}
                    modifiers={calendarModifiers}
                    minimumDate={tomorrow}
                />
            </DateWrapper>    
        </Wrapper>
        )
    }
}
