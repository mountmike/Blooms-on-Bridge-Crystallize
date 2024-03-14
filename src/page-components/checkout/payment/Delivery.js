import styled from 'styled-components';
import styles from './delivery.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { format, getDay, add } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { DatePickerCalendar } from 'react-nice-dates';
import 'react-nice-dates/build/style.css';
import { useEffect, useState } from 'react';
import { Button } from 'ui';

import { ErrorMessage } from '../styles';

const listOfDeliveryPostcodes = ['3677', '3669', '3666', '3630', '3722'];
const listOfMothersDays = [
  'Sun May 12 2024 00:00:00 GMT+1000 (Australian Eastern Standard Time)',
  'Sun May 11 2025 00:00:00 GMT+1000 (Australian Eastern Standard Time)',
  'Sun May 10 2026 00:00:00 GMT+1000 (Australian Eastern Standard Time)',
  'Sun May 09 2027 00:00:00 GMT+1000 (Australian Eastern Standard Time)',
  'Sun May 14 2028 00:00:00 GMT+1000 (Australian Eastern Standard Time)',
  'Sun May 13 2029 00:00:00 GMT+1000 (Australian Eastern Standard Time)',
  'Sun May 12 2030 00:00:00 GMT+1000 (Australian Eastern Standard Time)',
  'Sun May 11 2031 00:00:00 GMT+1000 (Australian Eastern Standard Time)',
  'Sun May 19 2032 00:00:00 GMT+1000 (Australian Eastern Standard Time)'
];

export default function Delivery({
  postcode,
  deliveryMethod,
  setDeliveryMethod,
  isReadyForStripe,
  setCustomer
}) {
  const [displayDeliveryChoice, setDisplayDeliveryChoice] = useState(
    new Date()
  );
  const [targetDate, setTargetDate] = useState();
  const [publicHolidays, setPublicHolidays] = useState(null);

  useEffect(() => {
    const baseDate = new Date();
    const fromDate = new Date().toISOString().split('T')[0];
    const toDate = new Date(baseDate.setDate(baseDate.getDate() + 90))
      .toISOString()
      .split('T')[0];
    const url = `https://wovg-community.gateway.prod.api.vic.gov.au/vicgov/v2.0/dates?type=PUBLIC_HOLIDAY&from_date=${fromDate}&to_date=${toDate}&format=json`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        apikey: process.env.NEXT_PUBLIC_VIC_IMPORTANT_DATES_KEY
      }
    };

    axios.get(url, config).then((res) =>
      setPublicHolidays(
        res.data.dates.map((el) => {
          let date = new Date(el.date);
          date.setHours(0, 0, 0, 0);
          return date.toString();
        })
      )
    );
  }, []);

  useEffect(() => {
    const shortDate = targetDate
      ? format(targetDate, 'dd MMM yyyy', { locale: enGB })
      : 'none';
    setCustomer((customer) => {
      return {
        ...customer,
        deliveryDate: targetDate?.toLocaleDateString('en-GB')
      };
    });
  }, [targetDate, setCustomer]);

  const calendarModifiers = {
    disabled: function (date) {
      let dateString = date.toString();
      // disable all sundays accept mothers day
      if (getDay(date) === 0 && !listOfMothersDays.includes(dateString)) {
        return true;
      }
      // disable public holidays
      if (publicHolidays.includes(dateString)) {
        return true;
      }
    }
  };

  const tomorrow = add(new Date(), { days: 1 });
  const maxDate = add(new Date(), { days: 90 });

  const handleDeliverySelection = (e) => {
    setDisplayDeliveryChoice(false);

    if (e.target.closest('button')?.name === 'collect') {
      setDeliveryMethod('collect');
    } else if (e.target.closest('button')?.name === 'deliver') {
      setDeliveryMethod('delivery');
    } else {
      setDeliveryMethod(e.target.value);
    }
  };

  const isInTown = () => {
    return postcode == '3672' ? true : false;
  };

  const isOutsideTown = () => {
    return listOfDeliveryPostcodes.includes(postcode) ? true : false;
  };

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

  const ColumnWrapper = styled.div`
    padding-right: 15px;
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    gap: 15px;
  `;

  const Label = styled.label`
    font-size: 1rem;
  `;

  const DateHeading = styled.span`
    display: flex;
    justify-content: center;
    gap: 10px;
    font-size: 1rem;
    @media only screen and (max-width: 768px) {
      margin: 0 10px;
    }
  `;

  const Radio = styled.input`
    width: 1.4rem;
    height: 1.4rem;
  `;

  const DateWrapper = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    width: 100%;
    margin: 30px 0;
    gap: 10px;
  `;

  return (
    <>
      {displayDeliveryChoice ? (
        <ColumnWrapper>
          <Button onClick={handleDeliverySelection} name="collect">
            Pickup
          </Button>
          <Button onClick={handleDeliverySelection} name="deliver">
            Calculate Delivery
          </Button>
        </ColumnWrapper>
      ) : (
        // if unable to deliver to inputed address, output error with option to collect in store
        <Wrapper onChange={handleDeliverySelection}>
          {!isInTown() &&
            !isOutsideTown() &&
            deliveryMethod != 'collect' &&
            postcode && (
              <div>
                <ErrorMessage>
                  I&apos;m sorry but I don&apos;t think we can deliver to that
                  location. Try giving us a call to see if we can make a special
                  arrangement.
                </ErrorMessage>
                <Button onClick={handleDeliverySelection} name="collect">
                  Or choose in-store pickup
                </Button>
              </div>
            )}

          {/* <Row>
                <div className={styles.tooltipContainer}>
                    <FontAwesomeIcon icon={faCircleInfo} width={20} height={20} />
                    <div className={styles.tooltipText}>
                        <span>Pickup from our shop in Benalla</span>
                    </div>
                </div>
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
            </Row> */}

          {isInTown() && (
            <Row>
              <div className={styles.tooltipContainer}>
                <FontAwesomeIcon icon={faCircleInfo} width={20} height={20} />
                <div className={styles.tooltipText}>
                  <span>Delivery within the township of Benalla.</span>
                </div>
              </div>
              <Label htmlFor="deliveryInTown">
                Delivery in Benalla - <b>$10</b>
              </Label>
              <Radio
                type="radio"
                id="deliveryInTown"
                name="deliverySelection"
                value="deliveryInTown"
                checked={deliveryMethod == 'deliveryInTown'}
                readOnly
                disabled={isReadyForStripe}
              />
            </Row>
          )}
          {isOutsideTown() && (
            <Row>
              <div className={styles.tooltipContainer}>
                <FontAwesomeIcon icon={faCircleInfo} width={20} height={20} />
                <div className={styles.tooltipText}>
                  <span>
                    Delivery to towns outside Benalla subject to courier
                    availability and will occur on weekdays only, as our
                    couriers do not work on weekends
                  </span>
                </div>
              </div>
              <Label htmlFor="deliveryOutsideTown">
                Delivery outside of Benalla - <b>$20</b>
              </Label>
              <Radio
                type="radio"
                id="deliveryOutsideTown"
                name="deliverySelection"
                value="deliveryOutsideTown"
                checked={deliveryMethod == 'deliveryOutsideTown'}
                readOnly
                disabled={isReadyForStripe}
              />
            </Row>
          )}

          <DateWrapper>
            <DateHeading>
              <div className={styles.tooltipContainer}>
                <FontAwesomeIcon icon={faCircleInfo} width={15} height={15} />
                <div className={styles.tooltipText}>
                  <span>
                    We try out best but cannot always guarantee exact delivery
                    dates. If we can&apos;t make the requested date, delivery
                    will be made the following business day.
                  </span>
                </div>
              </div>
              <b> Request delivery/pickup date:</b>{' '}
              {targetDate
                ? format(targetDate, 'dd MMM yyyy', { locale: enGB })
                : 'none'}
            </DateHeading>
            <DatePickerCalendar
              date={new Date()}
              onDateChange={setTargetDate}
              locale={enGB}
              modifiers={calendarModifiers}
              minimumDate={tomorrow}
              maximumDate={maxDate}
              format="dd MMM yyyy"
            />
          </DateWrapper>
        </Wrapper>
      )}
    </>
  );
}
