import React from "react";
import ReadyToPrintTable from "./ReadyToPrintTable";

const ReadyToPrint = () => {
  return (
    <div className="bg-white w-full">
      <div className="flex flex-col items-center">
        <span className="flex flex-col items-center">
          <span className="text-[24px] font-black">M/S. BELARUSH CORNER</span>
          <span>Wholesaler & Retailer of All Indian Tractor Spare's</span>
          <span>
            Founder:<span className="ml-1">Md. Showkotuzzaman (Robi)</span>
          </span>
          <span>
            Pro:<span className="ml-1">Md. Asibuzzaman (Leon)</span>
          </span>
          <span>
            Address: <span>Chanchra More, Jashore, Bangladesh.</span>
          </span>
        </span>
        <span className="table_1 mt-10">
          <table className="border-collapse border border-black w-[777px]">
            <tr>
              <td>
                <span className="flex justify-between px-2">
                  <span>
                    <span>
                      Order Id:<span className="ml-2">#</span>
                    </span>
                  </span>
                  <span>
                    <span>
                      Sold By:<span className="ml-2">Alvi</span>
                    </span>
                  </span>
                </span>
              </td>
            </tr>
            <tr>
              <td>
                <span className="flex justify-between px-2">
                  <span>
                    <span>
                      Date:<span className="ml-2">2023</span>
                    </span>
                  </span>
                  <span>
                    <span>
                      Purchased By:<span className="ml-2">Leon</span>
                    </span>
                  </span>
                </span>
              </td>
            </tr>
          </table>
        </span>
        <span className="table_2 flex items-center mt-10 w-[777px]">
          <table className="border-collapse border border-black">
            <thead>
              <tr>
                <th className="border border-black px-2">S/L</th>
                <th className="border border-black px-2 w-[508px]">
                  Items / Descriptions
                </th>
                <th className="border border-black px-2">Qty.</th>
                <th className="border border-black px-2">Unit Price</th>
                <th className="border border-black px-2">Total Price</th>
              </tr>
            </thead>
            <tbody>
              <ReadyToPrintTable />
            </tbody>
          </table>
        </span>
        <span className="table_3 flex justify-end w-[776px] pb-2 pr-3 pt-2 border border-black">
          <table className="text-end">
            <tr>
              <td className="px-2">
                <span>Total Price:</span>
              </td>
              <td className="px-2">
                <span>200000</span>
              </td>
            </tr>
            <tr>
              <td className="px-2">
                <span>Paid:</span>
              </td>
              <td className="px-2">
                <span>2000</span>
              </td>
            </tr>
            <tr>
              <td className="px-2">
                <span>Due:</span>
              </td>
              <td className="px-2">
                <span>2000</span>
              </td>
            </tr>
            <tr>
              <td className="px-2">
                <span>Change:</span>
              </td>
              <td className="px-2">
                <span>2000</span>
              </td>
            </tr>
            <tr className="border-t-2 border-black">
              <td className="px-2 py-2">
                <span>Grand Total:</span>
              </td>
              <td className="px-2 py-2">
                <span>2000</span>
              </td>
            </tr>
          </table>
        </span>
      </div>
    </div>
  );
};

export default ReadyToPrint;
