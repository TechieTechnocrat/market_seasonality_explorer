import React from "react";

export const OrderbookTable = ({ bids, asks }) => {
  return (
    <div>
      {" "}
      <div style={{ display: "flex", flexDirection: "row", gap: "2rem" }}>
        <div>
          <h4>Bids</h4>
          <table>
            <thead>
              <tr>
                <th>Price</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {bids &&
                bids.map(([price, qty], idx) => (
                  <tr key={idx}>
                    <td>{price}</td>
                    <td>{qty}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div>
          <h4>Asks</h4>
          <table>
            <thead>
              <tr>
                <th>Price</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {asks &&
                asks.map(([price, qty], idx) => (
                  <tr key={idx}>
                    <td>{price}</td>
                    <td>{qty}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
