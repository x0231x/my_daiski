'use client';

<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import Link from 'next/link';

export default function CoachesPage() {
  const [coaches, setCoaches] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [tempFilters, setTempFilters] = useState({
    keyword: '',
    boardTypes: [],
    languages: [],
  });
  const [filters, setFilters] = useState({
    keyword: '',
    boardTypes: [],
    languages: [],
  });

  useEffect(() => {
    fetch('http://localhost:3005/api/coaches')
      .then((res) => {
        if (!res.ok) throw new Error('讀取失敗');
        return res.json();
      })
      .then((data) => {
        setCoaches(data);
        setFiltered(data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setFiltered(
      coaches.filter((t) => {
        const mk = !filters.keyword || t.name.includes(filters.keyword);
        const mb =
          filters.boardTypes.length === 0 ||
          filters.boardTypes.some((bt) => t.boardtypes.includes(bt));
        const ml =
          filters.languages.length === 0 ||
          filters.languages.some((lg) => t.languages.includes(lg));
        return mk && mb && ml;
      })
    );
  }, [coaches, filters]);

  const handleSearch = () => setFilters({ ...tempFilters });
  const handleClear = () => {
    const empty = { keyword: '', boardTypes: [], languages: [] };
    setTempFilters(empty);
    setFilters(empty);
  };

  const toggleItem = (key, value) => {
    setTempFilters((f) => {
      const list = f[key].includes(value)
        ? f[key].filter((x) => x !== value)
        : [...f[key], value];
      return { ...f, [key]: list };
    });
  };

  if (loading) return <p className="text-center p-4">載入中…</p>;
  if (error)
    return <p className="text-center p-4 text-red-600">錯誤：{error}</p>;
  if (!filtered.length)
    return <p className="text-center p-4">找不到符合的教練。</p>;

  return (
    <main className="bg-gray-50 min-h-screen pb-8">
      <Card className="mx-auto mt-8 max-w-xl shadow-lg ">
        {/* <CardHeader>
          <CardTitle></CardTitle>
          <CardDescription> */}
        {/* 多選板別／語言，下拉後勾選，輸入關鍵字後按「搜尋」 */}
        {/* </CardDescription>
        </CardHeader> */}
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* 板別 下拉多選 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  單／雙板{' '}
                  {tempFilters.boardTypes.length > 0
                    ? `(${tempFilters.boardTypes.length})`
                    : ''}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                <DropdownMenuLabel>選擇板別</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {['單板', '雙板'].map((bt) => (
                  <DropdownMenuCheckboxItem
                    key={bt}
                    checked={tempFilters.boardTypes.includes(bt)}
                    onCheckedChange={() => toggleItem('boardTypes', bt)}
                  >
                    {bt}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 語言 下拉多選 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  授課語言{' '}
                  {tempFilters.languages.length > 0
                    ? `(${tempFilters.languages.length})`
                    : ''}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                <DropdownMenuLabel>選擇語言</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {['中文', '日文', '英文', '韓文', '粵語'].map((lg) => (
                  <DropdownMenuCheckboxItem
                    key={lg}
                    checked={tempFilters.languages.includes(lg)}
                    onCheckedChange={() => toggleItem('languages', lg)}
                  >
                    {lg}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {/* 關鍵字 */}
            <Input
              placeholder="請輸入關鍵字…"
              value={tempFilters.keyword}
              onChange={(e) =>
                setTempFilters((f) => ({ ...f, keyword: e.target.value }))
              }
              className="flex-shrink-0 w-40"
            />
            {/* 按鈕 */}
            <div className="ml-auto flex gap-2">
              <Button size="sm" onClick={handleSearch}>
                <Send className="mr-1" /> 搜尋
              </Button>
              <Button variant="outline" size="sm" onClick={handleClear}>
                <X className="mr-1" /> 清除
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 教練列表 */}
      <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-8">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl shadow p-6 text-center transform hover:scale-[1.02] transition"
          >
            <Link href={`/coaches/${t.id}`}>
              <Image
                src={`http://localhost:3005/${t.profilephoto}`}
                alt={t.name}
                width={150}
                height={150}
                className="w-32 h-32 rounded-full mx-auto object-cover"
              />
            </Link>
            <h2 className="mt-4 text-xl font-semibold">{t.name}</h2>
            <p className="mt-2 text-sm text-gray-600">
              板別：{t.boardtypes.join('、') || '無'}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              語言：{t.languages.join('、') || '無'}
            </p>
            <Link href={`/coaches/${t.id}#courses`}>
              <Button className="mt-4 w-full">查看課程</Button>
            </Link>
=======
import React, { useState } from 'react';
import { PiPersonSimpleSki } from 'react-icons/pi';
import { Funnel } from 'lucide-react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CoachesPage() {
  // 篩選狀態
  const [filters, setFilters] = useState({
    keyword: '',
    boardType: '', // '' | '單板' | '雙板'
    language: '', // '' | '中文' | '日文' | '英文'
  });

  // const searchBar = ({filters,setFilters}) => {
  //   const [tempKeyword, setTempKeyword] = useState(filters.keyword || "")
  //   const handleSearch = () => {
  //     setFilters((f) => )
  //   }
  // }
  const [showFilter, setShowFilter] = useState();
  // 教練清單：可以後端拿或者寫成 props 傳進來
  const teachers = [
    {
      id: 1,
      name: 'Lily',
      photo: '/lily.jpg',
      boardType: ['單板', '雙板'],
      languages: ['中文', '日文'],
      intro: '多語言教學，教學經驗豐富',
    },
    // ...你其他的老師
  ];

  // 套用篩選邏輯
  const filtered = teachers.filter((t) => {
    const matchKeyword = !filters.keyword || t.name.includes(filters.keyword);
    const matchBoard =
      !filters.boardType || t.boardType.includes(filters.boardType);
    const matchLang =
      !filters.language || t.languages.includes(filters.language);
    return matchKeyword && matchBoard && matchLang;
  });

  return (
    <main className=" bg-white">
      <div className=" mx-auto p-8">
        {/* 篩選列 */}
        <div className="flex items-center justify-center  gap-2 mb-4 relative">
          {/* 篩選按鈕 */}
          <Button
            variant="outline"
            id="filter-btn"
            onClick={() => {
              setShowFilter((v) => !v);
            }}
          >
            <Funnel />
            <span>篩選</span>
          </Button>

          <Select>
            <SelectTrigger className="w-[180px]">
              <Globe />
              <SelectValue placeholder="授課語言" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">中文</SelectItem>
              <SelectItem value="dark">日文</SelectItem>
              <SelectItem value="system">英文</SelectItem>
              <SelectItem value="system">韓文</SelectItem>
              <SelectItem value="system">粵語</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[180px]">
              <PiPersonSimpleSki />
              <SelectValue placeholder="單/雙板" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">單板</SelectItem>
              <SelectItem value="dark">雙板</SelectItem>
            </SelectContent>
          </Select>

          {/* 清除全部 */}
          {/* Chips 列表 */}
          {/* <div className="flex flex-wrap items-center gap-2 mb-6">
          {filters.keyword && (
            <div className="flex items-center bg-gray-800 text-white text-sm px-3 py-1 rounded-full">
              <span>{filters.keyword}</span>
              <button
                onClick={() => setFilters((f) => ({ ...f, keyword: '' }))}
                className="ml-1"
              ></button>
            </div>
          )}
          {filters.boardType && (
            <div className="flex items-center bg-gray-800 text-white text-sm px-3 py-1 rounded-full">
              <span>{filters.boardType}</span>
              <button
                onClick={() => setFilters((f) => ({ ...f, boardType: '' }))}
                className="ml-1"
              ></button>
            </div>
          )}
          {filters.language && (
            <div className="flex items-center bg-gray-800 text-white text-sm px-3 py-1 rounded-full">
              <span>{filters.language}</span>
              <button
                onClick={() => setFilters((f) => ({ ...f, language: '' }))}
                className="ml-1"
              ></button>
            </div>
          )}
        </div> */}
          {/* 關鍵字 */}
          <div className="flex w-100 max-w-sm items-center space-x-2">
            <Input
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
            </Button>
          </div>

          {/* 板類 */}
          {/* <div className="flex space-x-2">
          {['', '單板', '雙板'].map((type) => (
            <button
              key={type || 'all'}
              onClick={() => setFilters((f) => ({ ...f, boardType: type }))}
              className={`
                px-4 py-2 border rounded-lg transition
                ${
                  filters.boardType === type
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }
              `}
            >
              {type === '' ? '全部板類' : type}
            </button>
          ))}
        </div> */}
        </div>
      </div>
      {/* 教練卡片列表 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="max-w-xs mx-auto border-2 bordered rounded-2xl p-6 text-center"
          >
            <img
              src={t.photo}
              alt={t.name}
              className="w-32 h-32 rounded-full mx-auto object-cover"
            />
            <h2 className="mt-4 text-xl font-semibold flex items-center justify-center">
              <span className="mr-2"></span>
              {t.name}
            </h2>
            <p className="mt-2 text-gray-700">{t.boardType.join('、')}</p>
            <p className="mt-1 text-gray-700">語言：{t.languages.join('、')}</p>
            <p className="mt-1 text-gray-700">{t.intro}</p>
            <button className="mt-6 bg-gray-800 text-white text-sm px-6 py-2 rounded-full hover:bg-gray-700 transition">
              查看課程
            </button>
>>>>>>> 318e321f242dec24a9b5abd3cc1a5a6b0377536c
          </div>
        ))}
      </div>
    </main>
  );
}
