'use client';
import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import { getAllTables } from '@/lib/services/API_service';
import { useDispatch } from 'react-redux';
const DashBoard = () => {
    const router = useRouter();
    const handleClick = () => {
        router.push('/')
    }


    return (
        <>
            DashBoard Page
        </>
    )
}

export default DashBoard;
