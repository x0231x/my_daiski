<<<<<<< HEAD
// app/groups/page.js
=======
// group/page.js
>>>>>>> 318e321f242dec24a9b5abd3cc1a5a6b0377536c
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
<<<<<<< HEAD
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { CirclePlus, BadgeCheck, Megaphone } from 'lucide-react';
// 引入 Framer Motion
// 1. 安裝: npm install framer-motion 或 yarn add framer-motion
import { motion } from 'framer-motion';

export default function GroupsPage() {
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3005';

  const [groupStats, setGroupStats] = useState({
    total: 0,
    ongoing: 0,
    formed: 0,
  });
  const [latestGroups, setLatestGroups] = useState([]);
  const [loadingLatest, setLoadingLatest] = useState(true);

  // Framer Motion 不需要像 AOS 那樣在 useEffect 中初始化
  // 動畫直接在 JSX 中的 motion 組件上定義

  useEffect(() => {
    async function fetchGroupStats() {
      try {
        const statsRes = await fetch(`${API_BASE}/api/group/summary`);
        if (!statsRes.ok) throw new Error('無法獲取揪團統計數據');
        const statsData = await statsRes.json();
        setGroupStats({
          total: statsData.totalGroups || 0,
          ongoing: statsData.ongoingGroups || 0,
          formed: statsData.formedGroups || 0,
        });
      } catch (err) {
        console.error('載入揪團統計數據失敗:', err);
        setGroupStats({ total: 0, ongoing: 0, formed: 0 });
      }
    }
    async function fetchLatestGroups() {
      try {
        const res = await fetch(`${API_BASE}/api/group/latest`);
        if (!res.ok) throw new Error('無法獲取最新揪團列表');
        const data = await res.json();
        setLatestGroups(data);
      } catch (err) {
        console.error('獲取最新揪團列表失敗:', err);
        setLatestGroups([]);
      } finally {
        setLoadingLatest(false);
      }
    }
    fetchGroupStats();
    fetchLatestGroups();
  }, [API_BASE]);

  // 定義一個通用的滑入動畫變體
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.3 }, // amount: 0.3 表示元素可見30%時觸發
    transition: { duration: 0.6, ease: 'easeInOut' },
  };
  const fadeInRight = {
    initial: { opacity: 0, x: -60 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: false, amount: 0.3 },
    transition: { duration: 0.6, ease: 'easeInOut' },
  };
  const fadeInLeft = {
    initial: { opacity: 0, x: 60 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: false, amount: 0.3 },
    transition: { duration: 0.6, ease: 'easeInOut' },
=======
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CustomPagination } from './_components/group-pagination'; // 確保路徑和組件名稱正確
import Image from 'next/image';

export default function GroupsPage() {
  const router = useRouter();
  const API_BASE = 'http://localhost:3005';

  const [groups, setGroups] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    type: '全部',
    date: '',
    location: '全部',
    keyword: '',
  });
  const [typeOptions, setTypeOptions] = useState(['全部']);
  const [locationOptions, setLocationOptions] = useState(['全部']);

  useEffect(() => {
    async function loadFilterOptions() {
      try {
        const [typesRes, locsRes] = await Promise.all([
          fetch(`${API_BASE}/api/group?onlyTypes=true`),
          fetch(`${API_BASE}/api/location`),
        ]);
        const typesData = await typesRes.json();
        const locsData = await locsRes.json();

        const uniqueTypes = Array.from(new Set(typesData || []));
        setTypeOptions(['全部', ...uniqueTypes]);

        const locationNames = (locsData || []).map((loc) => loc.name);
        const uniqueLocationNames = Array.from(new Set(locationNames));
        setLocationOptions(['全部', ...uniqueLocationNames]);
      } catch (err) {
        console.error('載入篩選選項失敗:', err);
        setTypeOptions(['全部']);
        setLocationOptions(['全部']);
      }
    }
    loadFilterOptions();
  }, [API_BASE]);

  useEffect(() => {
    async function fetchGroups() {
      try {
        const params = new URLSearchParams();
        if (filters.type !== '全部') params.append('type', filters.type);
        if (filters.date) params.append('date', filters.date);
        if (filters.location !== '全部')
          params.append('location', filters.location);
        if (filters.keyword) params.append('keyword', filters.keyword);
        params.append('page', String(page));

        const q = params.toString();
        const res = await fetch(`${API_BASE}/api/group?${q}`);
        const data = await res.json();

        if (data && Array.isArray(data.groups)) {
          setGroups(data.groups);
          setTotalPages(data.totalPages || 1);
        } else if (Array.isArray(data)) {
          setGroups(data);
        } else {
          setGroups([]);
          setTotalPages(1);
        }
      } catch (err) {
        setGroups([]);
        setTotalPages(1);
      }
    }
    fetchGroups();
  }, [filters, page, API_BASE]);

  const handleJoin = (id) => {
    console.log('加入揪團', id);
>>>>>>> 318e321f242dec24a9b5abd3cc1a5a6b0377536c
  };

  return (
    <>
<<<<<<< HEAD
      {/* 跑馬燈 Section */}
      <section className="bg-secondary-200 dark:bg-slate-800 py-3 shadow-md">
        <div className="relative overflow-hidden max-w-screen-xl mx-auto">
          <div className="whitespace-nowrap animate-marquee pause text-primary-800 dark:text-white text-sm font-medium flex items-center gap-6 px-4">
=======
      <title>Daiski 揪團總覽</title>
      {/* 跑馬燈動畫 style 建議移至 globals.css 或 tailwind.config.js 中定義 */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
            /* .animate-marquee class 應該由 Tailwind 或 globals.css 提供 */
          `,
        }}
      />
      <section className="bg-secondary-200 py-3">
        <div className="relative overflow-hidden max-w-screen-xl mx-auto">
          <div className="whitespace-nowrap animate-marquee pause text-primary-800 text-p-tw font-medium flex items-center gap-4">
>>>>>>> 318e321f242dec24a9b5abd3cc1a5a6b0377536c
            <span>🏂 現正招募中：北海道出國團</span>
            <span>⛷️ 苗場初學教學團</span>
            <span>🎿 富良野自由行！</span>
            <span>📅 官方協助排課中</span>
<<<<<<< HEAD
            <span className="pl-6">🏂 現正招募中：北海道出國團</span>
            <span>⛷️ 苗場初學教學團</span>
            <span>🎿 富良野自由行！</span>
            <span>📅 官方協助排課中</span>
          </div>
        </div>
      </section>

      {/* Hero Section with Video */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
          src="/ProductHeroSection.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/60 -z-10" />
        <motion.div
          className="relative z-10 max-w-3xl mx-auto px-4 py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }} // Hero 區塊通常是立即顯示，所以用 animate 而非 whileInView
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-h4-tw sm:text-h2-tw md:text-h2-tw font-bold text-white mb-6 leading-tight">
            找人開團滑雪，
            <br className="sm:hidden" />
            一起嗨翻雪場！
          </h1>
          <p className="mt-4 text-h6-tw sm:text-h6-tw text-white/90 mb-8 max-w-xl mx-auto">
            不論是自由行或是想體驗教學，歡迎發起屬於你的行程，官方協助安排課程與教練，讓旅程更加完美！
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <motion.div
              initial={fadeInRight.initial}
              whileInView={fadeInRight.whileInView}
              viewport={fadeInRight.viewport}
              transition={{ ...fadeInRight.transition, delay: 0.3 }}
            >
              <Button
                onClick={() => router.push('/groups/create')}
                size="lg"
                className="px-10 py-6 bg-primary-500 hover:bg-primary-600 text-white text-[1.25rem] font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
              >
                立即開團
              </Button>
            </motion.div>
            <motion.div
              initial={fadeInLeft.initial}
              whileInView={fadeInLeft.whileInView}
              viewport={fadeInLeft.viewport}
              transition={{ ...fadeInLeft.transition, delay: 0.4 }}
            >
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push('/groups/list')}
                className="px-10 py-6 text-black text-[1.25rem] dark:bg-white dark:text-black border-white hover:bg-white hover:text-slate-900 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
              >
                查看揪團
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 統計卡片 - 浮動疊加樣式 */}
      <motion.div
        className="relative z-20 -mt-24 sm:-mt-28 md:-mt-20 flex justify-center px-4"
        initial={fadeInUp.initial}
        whileInView={fadeInUp.whileInView}
        viewport={fadeInUp.viewport}
        transition={{ ...fadeInUp.transition, duration: 1 }} // 可以為特定元素調整動畫時長
      >
        <div className="w-full max-w-2xl bg-white dark:bg-slate-800 shadow-2xl rounded-xl p-8 sm:p-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-0 sm:divide-x sm:divide-border dark:sm:divide-border text-center">
            <div className="px-4">
              <p className="text-h4-tw sm:text-h3-tw md:text-h2-tw font-bold text-primary-500 dark:text-primary transition-all duration-300 hover:scale-110">
                {groupStats.total}
              </p>
              <p className="text-sm sm:text-p-tw md:text-p-tw text-secondary-800 dark:text-muted-foreground mt-2">
                總揪團
              </p>
            </div>
            <div className="px-4">
              <p className="text-h4-tw sm:text-h3-tw md:text-h2-tw font-bold text-primary-500 dark:text-primary transition-all duration-300 hover:scale-110">
                {groupStats.ongoing}
              </p>
              <p className="text-sm sm:text-p-tw md:text-p-tw text-secondary-800 dark:text-muted-foreground mt-2">
                揪團中
              </p>
            </div>
            <div className="px-4">
              <p className="text-h4-tw sm:text-h3-tw md:text-h2-tw font-bold text-primary-500 dark:text-primary transition-all duration-300 hover:scale-110">
                {groupStats.formed}
              </p>
              <p className="text-sm sm:text-p-tw md:text-p-tw text-secondary-800 dark:text-muted-foreground mt-2">
                已成團
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 最新揪團 Section */}
      <section className="pt-20 sm:pt-32 md:pt-20 pb-16 md:pb-24 bg-white dark:bg-background">
        <div className="max-w-screen-xl mx-auto px-6">
          <motion.h2
            className="text-h3-tw sm:text-h2-tw font-bold text-center mb-12 sm:mb-16 text-secondary-800 dark:text-foreground"
            initial={fadeInUp.initial}
            whileInView={fadeInUp.whileInView}
            viewport={fadeInUp.viewport}
            transition={fadeInUp.transition}
          >
            最新揪團
          </motion.h2>
          {loadingLatest ? (
            <p className="text-center text-muted-foreground dark:text-muted-foreground py-10">
              載入最新揪團中...
            </p>
          ) : latestGroups.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {latestGroups.map((group, index) => (
                <motion.div
                  key={group.id} // 將 key 移到 motion.div
                  initial={fadeInUp.initial}
                  whileInView={fadeInUp.whileInView}
                  viewport={fadeInUp.viewport}
                  transition={{ ...fadeInUp.transition, delay: index * 0.1 }} // 錯開動畫
                >
                  <Card
                    className="p-0 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl flex flex-col group bg-white dark:bg-card border border-transparent hover:border-primary-500 dark:border-border dark:hover:border-primary h-full" //確保卡片等高，如果需要
                  >
                    <Link href={`/groups/${group.id}`} className="block">
                      <div className="relative w-full h-56 sm:h-60">
                        <Image
                          src={
                            group.imageUrl && group.imageUrl.startsWith('/')
                              ? `${API_BASE}${group.imageUrl}`
                              : group.imageUrl || '/deadicon.png'
                          }
                          alt={group.title || '揪團封面'}
                          fill
                          style={{ objectFit: 'cover' }}
                          className="group-hover:scale-105 transition-transform duration-300 rounded-t-xl"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                          onError={(e) => {
                            e.currentTarget.src = '/deadicon.png';
                            e.currentTarget.alt = '圖片載入失敗';
                          }}
                        />
                      </div>
                    </Link>
                    <CardContent className="p-5 flex flex-col flex-grow">
                      <p className="text-xs font-semibold text-primary-500 dark:text-primary mb-1 uppercase tracking-wider">
                        {group.type || '滑雪團'}
                      </p>
                      <h3 className="text-h6-tw font-semibold text-secondary-800 dark:text-foreground mb-2 leading-snug">
                        {group.title}
                      </h3>
                      <p className="text-sm text-secondary-800 dark:text-muted-foreground mb-3 flex-grow line-clamp-3">
                        {group.description}
                      </p>
                      <div className="mt-auto pt-3 border-t border-border dark:border-border/50 flex items-center justify-between text-xs text-muted-foreground dark:text-muted-foreground">
                        <span>{group.location || '地點未定'}</span>
                        <span>
                          {new Date(group.startDate).toLocaleDateString(
                            'zh-TW',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            }
                          )}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.p
              className="text-center text-muted-foreground dark:text-muted-foreground py-10"
              initial={fadeInUp.initial}
              whileInView={fadeInUp.whileInView}
              viewport={fadeInUp.viewport}
              transition={fadeInUp.transition}
            >
              目前沒有最新揪團。
            </motion.p>
          )}
        </div>
      </section>

      {/* Daiski 幫你揪 Section */}
      <section className="py-16 md:py-24 bg-secondary-200 dark:bg-background">
        <div className="max-w-screen-lg mx-auto px-6 text-center">
          <motion.h2
            className="text-h3-tw sm:text-h2-tw font-bold mb-12 sm:mb-16 text-secondary-800 dark:text-foreground"
            initial={fadeInUp.initial}
            whileInView={fadeInUp.whileInView}
            viewport={fadeInUp.viewport}
            transition={fadeInUp.transition}
          >
            Daiski 幫你揪
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                icon: CirclePlus,
                title: '免費開團',
                description:
                  '註冊開團完全免費，不收上架費，不限制開團數，輕鬆成為開團主。',
                animation: fadeInRight, // 使用定義好的變體
              },
              {
                icon: BadgeCheck,
                title: '快速審核',
                description:
                  '開團確認上架審核機制，審核快速準確，避免揪團資訊錯誤不到位。',
                animation: fadeInUp,
                delay: 0.1, // 稍微延遲中間的卡片
              },
              {
                icon: Megaphone,
                title: '社群曝光',
                description: '開團審核上架後可免費曝光，協助快速找到團員。',
                animation: fadeInLeft,
                delay: 0.2,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center p-6 sm:p-8 bg-white dark:bg-primary-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5"
                initial={feature.animation.initial}
                whileInView={feature.animation.whileInView}
                viewport={feature.animation.viewport}
                transition={{
                  ...feature.animation.transition,
                  delay: feature.delay || index * 0.1,
                }}
              >
                <div className="p-4 bg-secondary-200 dark:bg-primary/20 rounded-full mb-5">
                  <feature.icon
                    className="w-10 h-10 sm:w-12 sm:h-12 text-primary-500 dark:text-primary"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-h6-tw font-semibold mb-2 text-secondary-800 dark:text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-secondary-800 dark:text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
=======
          </div>
        </div>
      </section>

      {/* Hero Banner */}
      <section
        className="relative bg-cover bg-[center_80%] bg-no-repeat py-36 text-center"
        style={{
          backgroundImage: "url('/26852e04-a393-422d-bd61-8042373024da.png')", // 請確認此圖片路徑正確
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />{' '}
        {/* 使用黑色疊加和模糊效果 */}
        {/* 背景使用 bg-white 加上透明度，或者如果 :root 的 --background 是白色，用 bg-background/85 */}
        <div className="relative max-w-3xl mx-auto px-7 py-14 bg-white/85 shadow-2xl rounded-lg">
          {/* 假設 h2-tw 映射到 var(--text-h2-tw) */}
          {/* 假設 leading-h2-tw 映射到 var(--leading-h2-tw) */}
          <h2 className="font-extrabold mb-6 tracking-wider text-h2-tw text-primary-800 leading-h2-tw">
            找人開團滑雪，一起嗨翻雪場！
          </h2>
          {/* 假設 secondary-800 映射到 var(--color-secondary-800) */}
          {/* 假設 leading-p-tw 映射到 var(--leading-p-tw) */}
          <p className="mb-8 text-p-tw text-secondary-800 leading-p-tw">
            不論是自由行或是想體驗教學，歡迎發起屬於你的行程，官方協助安排課程與教練，讓旅程更加完美！
          </p>
          <div className="flex justify-center gap-6">
            {/* 假設 primary-500 映射到 var(--color-primary-500) */}
            {/* 假設 white 映射到 var(--color-white) */}
            <Button
              onClick={() => router.push('/groups/create')}
              className="px-8 py-3 bg-primary-500 text-white text-p-tw font-semibold shadow-lg transition transform hover:scale-105 rounded-md hover:bg-primary-600" // 加入 hover:bg-primary-600 (假設已定義)
            >
              立即開團
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/group')}
              className="px-8 py-3 border-primary-500 text-primary-500 text-p-tw font-semibold transition transform hover:scale-105 rounded-md hover:bg-primary-500/10" // hover 效果使用 primary-500 加上透明度
            >
              查看開團
            </Button>
          </div>
        </div>
      </section>

      {/* 篩選列 */}
      <section className="max-w-screen-xl mx-auto px-6 py-8">
        {/* form 使用 bg-card (來自 :root --card，通常是白色或淺色系) */}
        <form className="grid grid-cols-1 md:grid-cols-5 gap-6 bg-card p-6 shadow-md rounded-lg">
          <div>
            <Label
              htmlFor="type-filter"
              className="text-p-tw text-secondary-800" // Label 文字樣式
            >
              類型
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="type-filter"
                  variant="outline" // outline 按鈕會使用 shadcn 主題的 border 和 foreground 顏色
                  className="w-full justify-between mt-1 text-p-tw" // 按鈕內文字大小
                >
                  {filters.type} <span aria-hidden="true">▾</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                align="start"
                className="w-auto min-w-[theme(spacing.44)]" // Popover 內容區域
              >
                <div className="flex flex-col space-y-1 p-1">
                  {typeOptions.map((opt) => (
                    <Button
                      key={opt}
                      variant={filters.type === opt ? 'secondary' : 'ghost'} // secondary/ghost 按鈕使用 shadcn 主題色
                      onClick={() => setFilters((f) => ({ ...f, type: opt }))}
                      className="w-full justify-start text-p-tw" // 選項按鈕文字大小
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label
              htmlFor="date-filter"
              className="text-p-tw text-secondary-800"
            >
              日期
            </Label>
            <Input
              id="date-filter"
              type="date"
              value={filters.date}
              onChange={(e) =>
                setFilters((f) => ({ ...f, date: e.target.value }))
              }
              className="w-full mt-1 text-p-tw" // Input 內文字大小
            />
          </div>
          <div>
            <Label
              htmlFor="location-filter"
              className="text-p-tw text-secondary-800"
            >
              地點
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="location-filter"
                  variant="outline"
                  className="w-full justify-between mt-1 text-p-tw"
                >
                  {filters.location} <span aria-hidden="true">▾</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                align="start"
                className="w-auto min-w-[theme(spacing.44)]"
              >
                <div className="flex flex-col space-y-1 p-1">
                  {locationOptions.map((opt) => (
                    <Button
                      key={opt}
                      variant={filters.location === opt ? 'secondary' : 'ghost'}
                      onClick={() =>
                        setFilters((f) => ({ ...f, location: opt }))
                      }
                      className="w-full justify-start text-p-tw"
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="md:col-span-2">
            <Label
              htmlFor="keyword-filter"
              className="text-p-tw text-secondary-800"
            >
              關鍵字搜尋
            </Label>
            <Input
              id="keyword-filter"
              placeholder="輸入揪團名稱、描述等關鍵字..."
              value={filters.keyword}
              onChange={(e) =>
                setFilters((f) => ({ ...f, keyword: e.target.value }))
              }
              className="w-full mt-1 text-p-tw"
            />
          </div>
        </form>
      </section>

      {/* 卡片列表 */}
      <section className="max-w-screen-2xl mx-auto px-6 pb-16">
        {groups.length === 0 && (
          <div className="text-center py-10 text-secondary-800 text-p-tw">
            <p>目前沒有符合條件的揪團，試試調整篩選條件吧！</p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {groups.map((group, index) => (
            // Card 使用 bg-card (來自 :root --card) 和 text-foreground (來自 :root --foreground)
            <Card
              key={group.id}
              className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg flex flex-col group bg-card text-foreground"
            >
              <div className="relative w-full h-48">
                <Image
                  src={
                    group.images && group.images[0]?.imageUrl
                      ? `${API_BASE}${group.images[0].imageUrl}`
                      : '/deadicon.png' // 請確認此預留圖片路徑正確
                  }
                  alt={group.title || '揪團封面'}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw" // 調整 sizes
                  priority={index < 4} // 優先載入首屏的前幾張圖片
                />
              </div>

              <CardContent className="p-4 flex flex-col flex-grow">
                {' '}
                {/* CardContent 繼承 Card 的 text-foreground */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 truncate">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage
                        src={
                          group.user?.avatar
                            ? `${API_BASE}${group.user.avatar}`
                            : undefined
                        }
                        alt={group.user?.name || '開團者'}
                      />
                      <AvatarFallback>
                        {group.user?.name ? group.user.name[0] : 'D'}
                      </AvatarFallback>
                    </Avatar>
                    {/* 開團者文字使用 text-p-tw 和 text-secondary-800 */}
                    <span className="truncate text-p-tw text-secondary-800">
                      開團者：{group.user?.name || '匿名用戶'}
                    </span>
                  </div>
                  {/* Badge 會使用 shadcn 主題樣式，文字大小微調 */}
                  <Badge
                    variant="outline"
                    className="text-xs flex-shrink-0" // text-xs 是 Tailwind 預設的較小字體
                    // 如果想用 p-tw 的比例，可以像之前 style={{ fontSize: 'calc(var(--text-p-tw) * 0.85)' }}
                    // 或者在 tailwind.config.js 中定義一個更小的文字 class 如 text-caption-tw
                  >
                    {group.status || '未知'}
                  </Badge>
                </div>
                {/* 假設 h6-tw 映射到 var(--text-h6-tw) */}
                <h3 className="font-bold mb-1 leading-tight truncate text-h6-tw text-primary-800">
                  {group.title || '無標題揪團'}
                </h3>
                <p className="mb-1 truncate text-p-tw text-secondary-800 leading-p-tw">
                  {group.location || '地點未定'} ｜{' '}
                  {group.startDate && group.endDate
                    ? `${new Date(group.startDate).toLocaleDateString()} ~ ${new Date(group.endDate).toLocaleDateString()}`
                    : '日期未定'}
                </p>
                <p className="mb-4 text-p-tw text-secondary-800">
                  {typeof group.currentPeople === 'number' &&
                  typeof group.maxPeople === 'number'
                    ? `${group.currentPeople}/${group.maxPeople} 人`
                    : '人數未定'}
                </p>
                <div className="mt-auto pt-2 flex justify-between items-center">
                  <Button
                    variant="link"
                    className="px-0 text-p-tw text-primary-500 hover:text-primary-600" // text-primary-500 和 hover 效果
                    onClick={() => router.push(`/groups/${group.id}`)}
                  >
                    查看詳情
                  </Button>
                  <Button
                    size="sm"
                    className="font-semibold bg-primary-500 text-white text-base  hover:bg-primary-600" // 主要按鈕樣式
                    onClick={() => handleJoin(group.id)}
                  >
                    加入揪團
                    {/* <p className="text-white"> 加入揪團</p> */}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 分頁 */}
        <div className="mt-10 flex justify-center">
          <CustomPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </section>
>>>>>>> 318e321f242dec24a9b5abd3cc1a5a6b0377536c
    </>
  );
}
