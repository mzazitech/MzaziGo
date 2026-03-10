// components/FareDisplay.jsx
import React, { useState, useEffect } from 'react';
import { calculateFare, calculateDistance, estimateTotalFare } from '../../utils/Admin/FareCalculator';
import '../../styles/Admin/FareDisplay.css';

/**
 * Component แสดงค่าโดยสารสำหรับคนขับและผู้โดยสาร
 * ใช้ร่วมกับ LiveMap หรือเพื่อแสดงราคาสำหรับการเดินทางแต่ละครั้ง
 */
const FareDisplay = ({ driver, passenger, tripDetails }) => {
  const [fareEstimate, setFareEstimate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (driver && passenger && tripDetails) {
      calculateTripFare();
    }
  }, [driver, passenger, tripDetails]);

  const calculateTripFare = () => {
    setLoading(true);

    try {
      // คำนวณระยะทาง หากมีพิกัด
      let distance = tripDetails.distance;

      if (!distance && driver.location && passenger.location) {
        distance = calculateDistance(
          passenger.location.lat,
          passenger.location.lng,
          driver.location.lat,
          driver.location.lng
        );
      }

      // ประมาณค่าโดยสารทั้งหมด
      const estimate = estimateTotalFare({
        distance: distance || 0,
        vehicleType: driver.licenseType,
        duration: tripDetails.duration || 0,
        isPeakHours: tripDetails.isPeakHours || false
      });

      setFareEstimate(estimate);
    } catch (error) {
      console.error('Error calculating fare:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="fare-display-loading">Calculating fare...</div>;
  }

  if (!fareEstimate) {
    return <div className="fare-display-error">Unable to calculate fare</div>;
  }

  return (
    <div className="fare-display-container">
      {/* Driver & Passenger Info */}
      <div className="fare-info-header">
        <div className="trip-info">
          <div className="info-row">
            <span className="info-label">Driver:</span>
            <span className="info-value">{driver.name}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Passenger:</span>
            <span className="info-value">{passenger.name}</span>
          </div>
        </div>
        <div className="vehicle-info">
          <div className="info-row">
            <span className="info-label">Vehicle:</span>
            <span className="info-value">{driver.vehicle} ({driver.licenseType})</span>
          </div>
          <div className="info-row">
            <span className="info-label">Plate:</span>
            <span className="info-value">{driver.plateNumber}</span>
          </div>
        </div>
      </div>

      {/* Fare Breakdown */}
      <div className="fare-breakdown">
        <h3 className="breakdown-title">Fare Breakdown</h3>

        <div className="fare-item">
          <span className="fare-label">Base Fare</span>
          <span className="fare-value">฿{fareEstimate.baseFare.toFixed(2)}</span>
        </div>

        {tripDetails.distance && tripDetails.distance > 0 && (
          <div className="fare-item">
            <span className="fare-label">Distance ({tripDetails.distance.toFixed(2)} km)</span>
            <span className="fare-value">฿{fareEstimate.distanceFare.toFixed(2)}</span>
          </div>
        )}

        {fareEstimate.idleFare > 0 && (
          <div className="fare-item">
            <span className="fare-label">Idle Time ({tripDetails.duration || 0} min)</span>
            <span className="fare-value">฿{fareEstimate.idleFare.toFixed(2)}</span>
          </div>
        )}

        {fareEstimate.peakHoursFare > 0 && (
          <div className="fare-item peak-hours">
            <span className="fare-label">Peak Hours Surcharge</span>
            <span className="fare-value">฿{fareEstimate.peakHoursFare.toFixed(2)}</span>
          </div>
        )}

        <div className="fare-divider"></div>

        {/* Total Fare */}
        <div className="fare-total">
          <span className="total-label">Total Fare</span>
          <span className="total-value">฿{fareEstimate.totalFare.toFixed(2)}</span>
        </div>

        {/* Minimum Fare Note */}
        {fareEstimate.totalFare === fareEstimate.minimumFare && (
          <div className="fare-note minimum-note">
            *Minimum fare applied
          </div>
        )}
      </div>

      {/* Trip Details */}
      <div className="trip-details">
        <h3 className="details-title">Trip Details</h3>

        <div className="detail-item">
          <span className="detail-label">From:</span>
          <span className="detail-value">{passenger.pickupLocation || 'Not specified'}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">To:</span>
          <span className="detail-value">{passenger.destination || 'Not specified'}</span>
        </div>

        {tripDetails.distance && (
          <div className="detail-item">
            <span className="detail-label">Distance:</span>
            <span className="detail-value">{tripDetails.distance.toFixed(2)} km</span>
          </div>
        )}

        {tripDetails.duration && (
          <div className="detail-item">
            <span className="detail-label">Duration:</span>
            <span className="detail-value">{tripDetails.duration} minutes</span>
          </div>
        )}

        {tripDetails.isPeakHours && (
          <div className="detail-item peak">
            <span className="detail-label">Peak Hours:</span>
            <span className="detail-value">Yes</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="fare-actions">
        <button className="btn-accept">Accept</button>
        <button className="btn-decline">Decline</button>
      </div>
    </div>
  );
};

export default FareDisplay;