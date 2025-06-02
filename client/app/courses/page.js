'use client';
<<<<<<< HEAD

import React, { useState, useEffect } from 'react';
import { PiPersonSimpleSki } from 'react-icons/pi';
import { MapPinned } from 'lucide-react';
import { InputWithButton } from './_component/input';
import { DatePickerWithRange } from './_component/datepicker';
import Link from 'next/link';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Snowflake } from 'lucide-react';
import Image from 'next/image';
=======
>>>>>>> 318e321f242dec24a9b5abd3cc1a5a6b0377536c

import React, { useState, useEffect } from 'react';
import { PiPersonSimpleSki } from 'react-icons/pi';
import { MapPinned } from 'lucide-react';
import { InputWithButton } from './_component/input';
import { DatePickerWithRange } from './_component/datepicker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Snowflake } from 'lucide-react';
export default function CoursesPage(props) {
  const [filters, setFilters] = useState({
    keyword: '',
    boardType: '', // '' | '單板' | '雙板'
    language: '', // '' | '中文' | '日文' | '英文'
  });

<<<<<<< HEAD
  const [course, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3005/api/courses')
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`錯誤`);
        }
        return res.json();
      })
      .then((data) => {
        setCourses(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-center p-8">載入中…</p>;
  }
  if (error) {
    return <p className="text-center p-8 text-red-600">發生錯誤：{error}</p>;
  }

  return (
    <main className="bg-white ">
=======
  return (
    <main className="bg-white">
>>>>>>> 318e321f242dec24a9b5abd3cc1a5a6b0377536c
      {/* 篩選列 */}
      <div className=" mx-auto p-8">
        <div className="flex items-center justify-center  gap-2 mb-4 relative">
          <div className="flex flex-wrap items-center gap-4">
            <Select>
<<<<<<< HEAD
              <SelectTrigger className="w-[180px]"></SelectTrigger>
              <SelectContent>
                <SelectItem value="單板">單板</SelectItem>
                <SelectItem value="雙板">雙板</SelectItem>
=======
              <SelectTrigger className="w-[180px]">
                <PiPersonSimpleSki />
                <SelectValue placeholder="單/雙板" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">單板</SelectItem>
                <SelectItem value="dark">雙板</SelectItem>
>>>>>>> 318e321f242dec24a9b5abd3cc1a5a6b0377536c
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <MapPinned />
                <SelectValue placeholder="雪場" />
              </SelectTrigger>
              <SelectContent>
<<<<<<< HEAD
                <SelectItem value="二世谷">二世谷</SelectItem>
                <SelectItem value="野澤">野澤</SelectItem>
=======
                <SelectItem value="light">二世谷</SelectItem>
                <SelectItem value="dark">野澤</SelectItem>
>>>>>>> 318e321f242dec24a9b5abd3cc1a5a6b0377536c
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <Snowflake />
                <SelectValue placeholder="難易度" />
              </SelectTrigger>
              <SelectContent>
<<<<<<< HEAD
                <SelectItem value="初級">初級</SelectItem>
                <SelectItem value="中級">中級</SelectItem>
                <SelectItem value="高級">高級</SelectItem>
=======
                <SelectItem value="light">初級</SelectItem>
                <SelectItem value="dark">中級</SelectItem>
                <SelectItem value="dark">高級</SelectItem>
>>>>>>> 318e321f242dec24a9b5abd3cc1a5a6b0377536c
              </SelectContent>
            </Select>
            <DatePickerWithRange />
            {/* 關鍵字 */}
            <div className="flex w-100 max-w-sm items-center space-x-2">
              <InputWithButton />
<<<<<<< HEAD
=======
              {/* <Input
              type="text"
              placeholder="請輸入關鍵字..."
              value={filters.keyword}
              onChange={(e) =>
                setFilters((f) => ({ ...f, keyword: e.target.value }))
              }
            />
            <Button
              type="submit"
              onClick={(e) => {
                setFilters((f) => ({ ...f, keyword: e.target.value }));
              }}
            >
              <Send />
              搜尋
            </Button> */}
>>>>>>> 318e321f242dec24a9b5abd3cc1a5a6b0377536c
            </div>
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"></div> */}
          </div>
        </div>
      </div>
<<<<<<< HEAD
      {/* 課程卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {course.map((c) => (
          <div
            key={c.id}
            className="max-w-xs max-auto rounded-xl shadow-md overflow-hidden border"
          >
            <Link href={`/courses/${c.id}`}>
              <Image
                src={`http://localhost:3005/${c.photo}`}
                alt={c.name}
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
            </Link>

            <div className="p-4">
              <Link href={`/courses/${c.id}`}>
                <h3 className="">{c.name}</h3>
              </Link>
              <p className="text-sm text-gray-500 mt-1">{c.period}</p>
              <p className="text-sm  mt-2 mb-2">
                售價
                <span className="text-red-500"> $NT {c.price} </span>起
              </p>
              <hr />
              {/* 點按鈕也能進入詳細頁 */}
              <Link href={`/courses/${c.id}`}>
                <button className="mt-4 w-full bg-gray-800 text-white text-sm py-2 rounded-full hover:bg-gray-700 trsndition">
                  查看課程
                </button>
              </Link>
            </div>
          </div>
        ))}
=======
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        <div className="max-w-xs max-auto rounded-xl shadow-md overflow-hidden border">
          <img src="" alt="" className="w-full h-48 object-cover" />
          <div className="p-4">
            <h3 className="">S3 第三彈 野澤溫泉&東京五日行</h3>
            <p className="text-sm text-gray-500 mt-1">野澤新季度 啟動!</p>
            <p className="text-sm  mt-2 mb-2">
              售價<span className="text-red-500"> $NT 65,900 </span>起
            </p>
            <hr />
            <button className="mt-4 w-full bg-gray-800 text-white text-sm py-2 rounded-full hover:bg-gray-700 trsndition">
              立即報名
            </button>
          </div>
        </div>
>>>>>>> 318e321f242dec24a9b5abd3cc1a5a6b0377536c
      </div>
    </main>
  );
}
