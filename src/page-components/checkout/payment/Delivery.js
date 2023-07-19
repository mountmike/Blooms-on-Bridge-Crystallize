import styled from 'styled-components';

import { format } from 'date-fns'
import { enGB } from 'date-fns/locale'
import { DatePickerCalendar } from 'react-nice-dates'
import 'react-nice-dates/build/style.css'
import { useState } from 'react';

const willDeliverList = [
    "arcadia",
    "arcadia south",
    "cosgrove",
    "cosgrove south",
    "grahamvale",
    "karramomus",
    "kialla",
    "kialla east",
    "kialla west",
    "lemnos",
    "orrvale",
    "pine lodge",
    "shepparton east",
    "shepparton north",
    "tamleugh west",
    "dookie",
    "mount major",
    "nalinga",
    "waggarandall",
    "wattville",
    "yabba north",
    "yabba south",
    "youanmite",
    "balmattum",
    "creighton",
    "creightons creek",
    "euroa",
    "gooram",
    "kelvin view",
    "kithbrook",
    "miepoll",
    "moglonemby",
    "molka",
    "riggs creek",
    "ruffy",
    "sheans creek",
    "strathbogie",
    "tarcombe",
    "boho",
    "boho south",
    "creek junction",
    "earlston",
    "gowangardie",
    "koonda",
    "marraweeney",
    "tamleugh",
    "tamleugh north",
    "upotipotpon",
    "violet town",
    "baddaginnie",
    "tarnook",
    "warrenbayne",
    "broken creek",
    "goomalibee",
    "kilfeera",
    "lake mokoan",
    "lima",
    "lima east",
    "lima south",
    "lurg",
    "molyullah",
    "moorngag",
    "samaria",
    "swanpool",
    "tatong",
    "upotipotpon",
    "upper lurg",
    "upper ryans creek",
    "winton",
    "winton north",
    "boweya",
    "boweya north",
    "glenrowan",
    "glenrowan west",
    "greta",
    "greta south",
    "greta west",
    "hansonville",
    "mount bruno",
    "taminick",
    "appin park",
    "wangaratta",
    "wangaratta west",
    "yarrunga",
    "bobinawarrah",
    "boorhaman",
    "boorhaman east",
    "bowser",
    "byawatha",
    "carboor",
    "cheshunt",
    "cheshunt south",
    "docker",
    "dockers plains",
    "east wangaratta",
    "edi",
    "edi upper",
    "everton",
    "everton upper",
    "killawarra",
    "king valley",
    "laceby",
    "londrigan",
    "markwood",
    "meadow creek",
    "milawa",
    "north wangaratta",
    "oxley",
    "oxley flats",
    "peechelba",
    "peechelba east",
    "rose river",
    "tarrawingee",
    "wabonga",
    "waldara",
    "wangandary",
    "wangaratta forward",
    "wangaratta south",
    "whitlands",
    "archerton",
    "barjarg",
    "boorolite",
    "bridge creek",
    "delatite",
    "gaffneys creek",
    "goughs bay",
    "howes creek",
    "howqua",
    "howqua hills",
    "howqua inlet",
    "jamieson",
    "kevington",
    "macs cove",
    "maindample",
    "matlock",
    "merrijig",
    "mount buller",
    "mountain bay",
    "nillahcootie",
    "piries",
    "sawmill settlement",
    "tolmie",
    "woods point",
    "boxwood",
    "chesney vale",
    "goorambat",
    "major plains",
    "stewarton",
    "bungeet",
    "bungeet west",
    "devenish",
    "thoona",
    "almonds",
    "lake rowan",
    "pelluebla",
    "st james",
    "waggarandall",
    "yundool",
    "boomahnoomoonah",
    "tungamah",
    "wilby",
    "youarang",
    "moyhu",
    "myrrhee",
    "whitfield"
];

export default function Delivery({ suburb, deliveryMethod, setDeliveryMethod, isReadyForStripe, setDeliveryAddress, deliveryAddress }) {
    const [date, setDate] = useState()
    const handleDeliverySelection = (e) => {
        setDeliveryMethod(e.target.value)
    }
 
    const isInTown = () => {
        return suburb.toLowerCase() === "benalla" ? true : false
    }

    const isOutsideTown = () => {
        return willDeliverList.includes(suburb.toLowerCase()) ? true : false
    }

    const Row = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    background: white;
    height: 2rem;
    padding: 5%;
    `;

    const Wrapper = styled.div`
        padding-right: 15px;
    `;

    const Label = styled.label`
    font-size: 1rem;
    `

    const Radio = styled.input`
    width: 1.4rem;
    height: 1.4rem;
    `

    if (!suburb) {
        return (
            <Wrapper>
                <span>Please enter a valid address to calculate delivery</span>
            </Wrapper>
        )
    } else {
        return (
        <Wrapper onChange={handleDeliverySelection}>
            <Row>
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
                <Label htmlFor="deliveryOutsideTown">Delivery outside of Benalla - <b>$15</b></Label>
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
            <br />
            <Label><b>Delivery Date:</b> {date ? format(date, 'dd MMM yyyy', { locale: enGB }) : 'none'}</Label>
            <DatePickerCalendar date={date} onDateChange={setDate} locale={enGB} />
      
            
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoItem label="Please select a delivery/collection date">
                    <MobileDatePicker 
                    
                        shouldDisableDate={isSunday}
                        disablePast
                        // onChange={(newValue) => setDeliveryAddress({ ...deliveryAddress, deliveryDate: newValue.$d })}
                    />
                    </DemoItem>
            </LocalizationProvider>   */}
            <br />        
        </Wrapper>
        )
    }
}
