'use client';

import React, { useState, useEffect } from 'react';

export default function PaymentOption({ optionName = '', radioValue = '' }) {
  return (
    <>
      <label className="inline-flex items-center space-x-2 relative">
        <input
          type="radio"
          name="payment"
          value={radioValue}
          className="peer appearance-none w-4 h-4 rounded-full border-2 border-primary-600   checked:border-primary-600"
        />
        <span className="pointer-events-none w-2  h-2 rounded-full bg-primary-600 absolute left-1 my-auto opacity-0 peer-checked:opacity-100" />

        <h6 className=" text-p-tw">{optionName}</h6>
      </label>
    </>
  );
}
