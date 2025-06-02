// app/create-group/page.js
'use client';

<<<<<<< HEAD
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import GroupForm from '../_components/group-form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import Image from 'next/image';

const STEPS_CONFIG = [
  { id: 'step1', name: '步驟 1', description: '基本資訊' },
  { id: 'step2', name: '步驟 2', description: '預覽與發佈' },
];

// 預設表單值，用於創建時的初始狀態
const DEFAULT_CREATE_VALUES = {
  type: '',
  title: '',
  startDate: '',
  endDate: '',
  locationId: '',
  customLocation: '',
  difficulty: '',
  minPeople: 2,
  maxPeople: 10,
  price: 0,
  allowNewbie: true,
  description: '',
  coverFile: null,
  id: 0, // 標識為新創建
  coverPreview: '',
};
=======
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CreateGroupPage() {
  const router = useRouter();
  const API_BASE = 'http://localhost:3005';
  const [step, setStep] = useState('step1');

  // 活動類型 (SKI / MEAL)
  const [typeOptions, setTypeOptions] = useState([]);
  const [type, setType] = useState('SKI');

  // 滑雪場清單
  const [locationOptions, setLocationOptions] = useState([]);
  const [locationId, setLocationId] = useState('');

  // 聚餐自訂地址
  const [customLocation, setCustomLocation] = useState('');

  // 其它欄位
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minPeople, setMinPeople] = useState(1);
  const [maxPeople, setMaxPeople] = useState(6);
  const [price, setPrice] = useState(0);
  const [allowNewbie, setAllowNewbie] = useState(false);
  const [description, setDescription] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const fileInputRef = useRef(null);

  // 載入活動類型
  useEffect(() => {
    async function loadTypes() {
      try {
        const res = await fetch(`${API_BASE}/api/group?onlyTypes=true`);
        const keys = await res.json(); // e.g. ["SKI","MEAL"]
        const map = { SKI: '滑雪', MEAL: '聚餐' };
        const opts = keys.map((k) => ({ value: k, label: map[k] || k }));
        setTypeOptions(opts);
        setType(opts[0]?.value || 'SKI');
      } catch (err) {
        console.error('載入類型失敗', err);
      }
    }
    loadTypes();
  }, []);

  // 當 type = SKI 時載入滑雪場
  useEffect(() => {
    if (type !== 'SKI') return;
    async function loadLocations() {
      try {
        const res = await fetch(`${API_BASE}/api/location`);
        const list = await res.json();
        setLocationOptions(list);
        setLocationId(list[0]?.id?.toString() || '');
      } catch (err) {
        console.error('載入地點失敗', err);
      }
    }
    loadLocations();
  }, [type]);

  // 封面檔案處理
  const handleCoverChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setCoverFile(f);
      setCoverPreview(URL.createObjectURL(f));
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) {
      setCoverFile(f);
      setCoverPreview(URL.createObjectURL(f));
    }
  };

  const handleCancel = () => router.push('/groups');

  // 提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !startDate || !endDate) return alert('請填寫標題與日期');
    if (type === '滑雪' && !locationId) return alert('請選擇滑雪場');
    if (type === '聚餐' && !customLocation) return alert('請輸入餐廳地址');

    const formData = new FormData();
    formData.append('type', type);
    formData.append('title', title);
    formData.append('start_date', startDate);
    formData.append('end_date', endDate);
    if (type === '滑雪') {
      formData.append('location', locationId);
    } else {
      formData.append('customLocation', customLocation);
    }
    formData.append('min_people', String(minPeople));
    formData.append('max_people', String(maxPeople));
    formData.append('price', String(price));
    formData.append('allow_newbie', allowNewbie ? '1' : '0');
    formData.append('description', description);
    if (coverFile) formData.append('cover', coverFile);

    try {
      const res = await fetch(`${API_BASE}/api/group`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error((await res.text()) || res.status);
      router.push('/groups');
    } catch (err) {
      console.error(err);
      alert('建立失敗：' + err.message);
    }
  };
>>>>>>> 318e321f242dec24a9b5abd3cc1a5a6b0377536c

const HorizontalStepper = ({ steps, currentStepId, setCurrentStep }) => {
  const currentStepIndex = steps.findIndex((s) => s.id === currentStepId);
  return (
<<<<<<< HEAD
    <nav aria-label="Progress" className="mb-10">
      <ol className="flex items-start">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={`relative flex-1 ${stepIdx < steps.length - 1 ? 'pr-8 sm:pr-12' : ''}`}
          >
            <button
              type="button"
              onClick={() =>
                stepIdx <= currentStepIndex && setCurrentStep(step.id)
              }
              className={`flex flex-col items-center text-center group w-full ${stepIdx <= currentStepIndex ? 'cursor-none' : 'cursor-default'}`}
              disabled={stepIdx > currentStepIndex}
            >
              <span
                className={`relative flex h-10 w-10 items-center justify-center rounded-full ${stepIdx === currentStepIndex ? 'bg-primary border-2 border-primary text-primary-foreground' : stepIdx < currentStepIndex ? 'bg-primary text-primary-foreground' : 'border-2 border-border bg-card dark:border-border-dark dark:bg-card-dark text-muted-foreground dark:text-muted-foreground-dark'}`}
              >
                {stepIdx < currentStepIndex ? '✓' : stepIdx + 1}
              </span>
              <span
                className={`mt-2 block text-xs sm:text-sm font-medium ${stepIdx <= currentStepIndex ? 'text-primary' : 'text-muted-foreground dark:text-muted-foreground-dark'}`}
              >
                {step.name}
              </span>
              <span
                className={`text-xs ${stepIdx <= currentStepIndex ? 'text-primary/80' : 'text-muted-foreground/80 dark:text-muted-foreground-dark/80'} hidden sm:block`}
              >
                {step.description}
              </span>
            </button>
            {stepIdx < steps.length - 1 ? (
              <div
                className={`absolute top-5 left-1/2 w-full h-0.5 -translate-y-1/2 ${stepIdx < currentStepIndex ? 'bg-primary' : 'bg-border dark:bg-border-dark'}`}
                style={{
                  transform:
                    'translateX(calc(50% + var(--stepper-icon-radius, 1.25rem) / 2 + var(--stepper-gap, 0.5rem)))',
                  width:
                    'calc(100% - var(--stepper-icon-radius, 1.25rem) - 2 * var(--stepper-gap, 0.5rem))',
                }}
                aria-hidden="true"
              />
            ) : null}
          </li>
        ))}
      </ol>
      <style jsx>{`
        li {
          --stepper-icon-radius: 2.5rem;
          --stepper-gap: 0.5rem;
        }
        @media (min-width: 640px) {
          li {
            --stepper-gap: 1.5rem;
          }
        }
      `}</style>
    </nav>
  );
};

const LivePreviewCard = ({
  formData,
  typeOptions,
  locationOptions,
  coverPreview,
}) => {
  const {
    title,
    type,
    startDate,
    endDate,
    locationId,
    customLocation,
    difficulty,
    minPeople,
    maxPeople,
    price,
    allowNewbie,
    description,
  } = formData || {};

  const selectedTypeLabel = type
    ? typeOptions.find((opt) => opt.value === type)?.label || type
    : '未選擇';
  let locationDisplay = '未指定';
  if (type === '滑雪' && locationId) {
    locationDisplay =
      locationOptions.find((l) => String(l.id) === String(locationId))?.name ||
      '讀取中...';
  } else if (customLocation) {
    locationDisplay = customLocation;
  }
  const skiDifficultyOptionsPreview = [
    { value: '初級', label: '初級' },
    { value: '中級', label: '中級' },
    { value: '進階', label: '進階' },
  ];
  const difficultyDisplay = difficulty
    ? skiDifficultyOptionsPreview.find((opt) => opt.value === difficulty)
        ?.label || difficulty
    : '';

  return (
    <Card className="shadow-lg bg-card text-card-foreground dark:bg-card-dark dark:text-card-foreground-dark border border-border dark:border-border-dark">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">即時預覽</CardTitle>
      </CardHeader>
      <CardContent>
        {coverPreview ? (
          <Image
            width={1024} // 你預估的一個寬
            height={960} // 依比例算出高
            src={coverPreview}
            alt="封面預覽"
            className="w-full h-48 object-cover rounded-md mb-4 bg-muted dark:bg-muted-dark border border-border dark:border-border-dark"
            onError={(e) =>
              (e.target.src =
                'https://placehold.co/600x400/E2E8F0/A0AEC0?text=圖片預覽失敗')
            }
          />
        ) : (
          <div className="w-full h-48 bg-muted dark:bg-muted-dark rounded-md mb-4 flex flex-col items-center justify-center text-muted-foreground dark:text-muted-foreground-dark border border-dashed border-border dark:border-border-dark">
            <span className="text-3xl">🖼️</span>
            <p className="mt-2 text-sm">封面圖片預覽</p>
          </div>
        )}
        <h3 className="text-xl font-bold mb-2 truncate">
          {title || '您的揪團標題'}
        </h3>
        <div className="space-y-1.5 text-sm text-muted-foreground dark:text-muted-foreground-dark">
          <p>
            <span className="font-medium text-foreground dark:text-foreground-dark">
              類型：
            </span>
            {selectedTypeLabel}
          </p>
          <p>
            <span className="font-medium text-foreground dark:text-foreground-dark">
              日期：
            </span>
            {startDate || '開始日期'} ~ {endDate || '結束日期'}
          </p>
          <p>
            <span className="font-medium text-foreground dark:text-foreground-dark">
              地點：
            </span>
            {locationDisplay}
          </p>
          {type === '滑雪' && difficultyDisplay && (
            <p>
              <span className="font-medium text-foreground dark:text-foreground-dark">
                難度：
              </span>
              {difficultyDisplay}
            </p>
          )}
          <p>
            <span className="font-medium text-foreground dark:text-foreground-dark">
              人數：
            </span>
            {minPeople || 'N'} - {maxPeople || 'N'} 人
          </p>
          <p>
            <span className="font-medium text-foreground dark:text-foreground-dark">
              費用：
            </span>
            NT$ {price || '0'} / 每人
          </p>
          <p>
            <span className="font-medium text-foreground dark:text-foreground-dark">
              歡迎新手：
            </span>
            {allowNewbie ? '是' : '否'}
          </p>
          {description && (
            <div className="mt-2 pt-2 border-t border-border dark:border-border-dark">
              <p className="font-medium text-foreground dark:text-foreground-dark">
                描述：
              </p>
              <p className="whitespace-pre-wrap truncate h-16">{description}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function CreateGroupPageWithAuth() {
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3005';
  const {
    user: authUser,
    isAuth,
    isLoading: authIsLoading,
    didAuthMount,
  } = useAuth();

  const [currentStep, setCurrentStep] = useState('step1');
  const [typeOptions, setTypeOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Parent component holds the form data for preview and final submission
  const [previewFormData, setPreviewFormData] = useState(DEFAULT_CREATE_VALUES);
  const [previewCover, setPreviewCover] = useState('');

  // Load type options and set initial type for the form (via initialFormValues)
  useEffect(() => {
    async function loadTypes() {
      try {
        const res = await fetch(`${API_BASE}/api/group?onlyTypes=true`);
        if (!res.ok) throw new Error('無法獲取活動類型');
        const labels = await res.json();
        const opts = labels.map((label) => ({ value: label, label: label }));
        setTypeOptions(opts);
        // Set initial type in previewFormData if not already set by GroupForm's defaults
        if (opts.length > 0 && !previewFormData.type) {
          // This will be used by initialFormValues for GroupForm
          setPreviewFormData((prev) => ({ ...prev, type: opts[0].value }));
        }
      } catch (err) {
        console.error('Error loading types:', err);
        setFormError('無法載入活動類型');
      }
    }
    loadTypes();
  }, [API_BASE]); // Run once

  // Load location options based on type selected in previewFormData
  useEffect(() => {
    if (previewFormData.type !== '滑雪') {
      setLocationOptions([]);
      return;
    }
    async function loadLocations() {
      try {
        const res = await fetch(`${API_BASE}/api/location`);
        if (!res.ok) throw new Error('無法獲取滑雪場列表');
        setLocationOptions((await res.json()) || []);
      } catch (err) {
        console.error('Error loading locations:', err);
        setFormError('無法載入滑雪場地點');
      }
    }
    loadLocations();
  }, [previewFormData.type, API_BASE]);

  // Callback for GroupForm to update parent's preview state
  const handleFormChange = useCallback(
    (formDataFromChild, coverPreviewFromChild) => {
      setPreviewFormData(formDataFromChild);
      setPreviewCover(coverPreviewFromChild);
    },
    []
  );

  const validateStep1 = useCallback((formData) => {
    setFormError('');
    if (!formData.type) {
      setFormError('請選擇活動類型');
      return false;
    }
    if (!formData.title?.trim()) {
      setFormError('請輸入揪團標題');
      return false;
    }
    if (!formData.startDate || !formData.endDate) {
      setFormError('請選擇活動日期');
      return false;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setFormError('開始日期不能晚於結束日期');
      return false;
    }
    if (formData.type === '滑雪' && !formData.locationId) {
      setFormError('滑雪活動請選擇滑雪場');
      return false;
    }
    if (formData.type !== '滑雪' && !formData.customLocation?.trim()) {
      setFormError('此類型活動請輸入地點');
      return false;
    }
    if (
      Number(formData.minPeople) < 1 ||
      Number(formData.maxPeople) < 1 ||
      Number(formData.minPeople) > Number(formData.maxPeople)
    ) {
      setFormError('請輸入有效的人數範圍');
      return false;
    }
    if (Number(formData.price) < 0) {
      setFormError('費用不能為負數');
      return false;
    }
    if (!formData.description?.trim()) {
      setFormError('請填寫活動描述');
      return false;
    }
    return true;
  }, []);

  const handleNextStep = () => {
    if (validateStep1(previewFormData)) {
      setCurrentStep('step2');
      window.scrollTo(0, 0);
    }
  };
  const handlePrevStep = () => {
    setCurrentStep('step1');
    window.scrollTo(0, 0);
  };

  const handleFinalSubmit = async () => {
    if (currentStep === 'step1' && !validateStep1(previewFormData)) return;
    if (!isAuth) {
      setFormError('請先登入才能建立揪團。');
      return;
    }
    setIsSubmitting(true);
    setFormError('');
    const formDataToSend = new FormData();
    Object.keys(previewFormData).forEach((key) => {
      if (key === 'coverFile' && previewFormData[key] instanceof File) {
        formDataToSend.append('cover', previewFormData[key]);
      } else if (
        key !== 'coverFile' &&
        key !== 'id' &&
        key !== 'coverPreview' &&
        previewFormData[key] !== null &&
        previewFormData[key] !== undefined
      ) {
        if (key === 'startDate')
          formDataToSend.append('start_date', previewFormData[key]);
        else if (key === 'endDate')
          formDataToSend.append('end_date', previewFormData[key]);
        else if (key === 'locationId' && previewFormData.type === '滑雪')
          formDataToSend.append('location', previewFormData[key]);
        else if (key === 'minPeople')
          formDataToSend.append('min_people', String(previewFormData[key]));
        else if (key === 'maxPeople')
          formDataToSend.append('max_people', String(previewFormData[key]));
        else if (key === 'allowNewbie')
          formDataToSend.append(
            'allow_newbie',
            previewFormData[key] ? '1' : '0'
          );
        else formDataToSend.append(key, previewFormData[key]);
      }
    });

    try {
      const res = await fetch(`${API_BASE}/api/group`, {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include',
      });
      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ error: '發生未知錯誤' }));
        throw new Error(errorData.error || `伺服器錯誤: ${res.status}`);
      }
      const newGroup = await res.json();
      if (newGroup && newGroup.id) {
        alert('揪團建立成功！');
        router.push(`/groups/${newGroup.id}`);
      } else {
        console.error('後端未返回有效的揪團 ID:', newGroup);
        setFormError('建立成功，但無法獲取新揪團的 ID，請稍後在列表中查看。');
        router.push('/groups');
      }
    } catch (err) {
      console.error('建立揪團失敗:', err);
      setFormError('建立失敗：' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // initialValues for GroupForm, memoized and stable for "create" mode
  const initialFormValuesForCreate = useMemo(() => {
    return {
      ...DEFAULT_CREATE_VALUES, // Start with defined defaults
      type: typeOptions[0]?.value || DEFAULT_CREATE_VALUES.type, // Set default type from options if available
    };
  }, [typeOptions]); // Only depends on typeOptions for initial setup

  if (authIsLoading || !didAuthMount) {
    /* ... loading UI ... */
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center text-xl bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
        <svg
          className="animate-spin -ml-1 mr-3 h-8 w-8 text-sky-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        身份驗證中...
      </div>
    );
  }
  if (!isAuth) {
    /* ... login prompt UI ... */
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-900">
        <Card className="w-full max-w-md shadow-lg bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              請先登入
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 dark:text-slate-300 mb-6">
              您需要登入才能建立揪團。
            </p>
            <Button
              onClick={() => router.push('/auth/login')}
              className="bg-sky-600 hover:bg-sky-700 text-white"
            >
              前往登入
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50 py-8 px-4">
      <div className="max-w-screen-2xl mx-auto">
        <HorizontalStepper
          steps={STEPS_CONFIG}
          currentStepId={currentStep}
          setCurrentStep={setCurrentStep}
        />
        {formError /* ... error display ... */ && (
          <div
            role="alert"
            className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-500 text-red-700 dark:text-red-200 rounded-md"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <span role="img" aria-label="error-icon" className="text-xl">
                  ⚠️
                </span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium">發生錯誤</h3>
                <div className="mt-1 text-sm">
                  <p>{formError}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="lg:flex lg:gap-8 xl:gap-12">
          <div className="lg:w-7/12 xl:w-2/3">
            {currentStep === 'step1' && (
              <GroupForm
                initialValues={initialFormValuesForCreate} // Use stable initial values
                onSubmit={() => {}}
                isLoading={isSubmitting}
                typeOptions={typeOptions}
                locationOptions={locationOptions}
                formError={formError}
                setFormError={setFormError}
                onFormDataChange={handleFormChange}
              />
            )}
            {currentStep === 'step2' /* ... confirmation card ... */ && (
              <Card className="shadow-xl bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-50 border border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">
                    確認揪團資訊
                  </CardTitle>
                  <CardDescription className="text-slate-500 dark:text-slate-400">
                    請仔細核對以下資訊，確認無誤後即可發佈揪團！
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    <p>
                      <strong>活動類型：</strong>
                      {previewFormData.type || '未選擇'}
                    </p>
                    <p>
                      <strong>揪團標題：</strong>
                      {previewFormData.title}
                    </p>
                    <p>
                      <strong>開始日期：</strong>
                      {previewFormData.startDate}
                    </p>
                    <p>
                      <strong>結束日期：</strong>
                      {previewFormData.endDate}
                    </p>
                    <p className="md:col-span-2">
                      <strong>活動地點：</strong>
                      {previewFormData.type === '滑雪'
                        ? locationOptions.find(
                            (l) =>
                              String(l.id) ===
                              String(previewFormData.locationId)
                          )?.name || '未選擇'
                        : previewFormData.customLocation}
                    </p>
                    {previewFormData.type === '滑雪' &&
                      previewFormData.difficulty && (
                        <p>
                          <strong>滑雪難易度：</strong>
                          {previewFormData.difficulty || '未指定'}
                        </p>
                      )}
                    <p>
                      <strong>最少人數：</strong>
                      {previewFormData.minPeople} 人
                    </p>
                    <p>
                      <strong>最多人數：</strong>
                      {previewFormData.maxPeople} 人
                    </p>
                    <p className="md:col-span-2">
                      <strong>預估費用：</strong>NT$ {previewFormData.price} /
                      每人
                    </p>
                    <p className="md:col-span-2">
                      <strong>歡迎新手：</strong>
                      {previewFormData.allowNewbie ? '是' : '否'}
                    </p>
                  </div>
                  <div className="pt-2">
                    <p className="font-medium">
                      <strong>活動描述：</strong>
                    </p>
                    <p className="whitespace-pre-wrap pl-1 mt-1 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 p-3 rounded-md min-h-[60px]">
                      {previewFormData.description || '無描述內容'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            <div className="mt-8 flex justify-end space-x-4">
              {currentStep === 'step1' && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/groups')}
                    type="button"
                  >
                    放棄
                  </Button>
                  <Button onClick={handleNextStep} type="button">
                    下一步
                  </Button>
                </>
              )}
              {currentStep === 'step2' && (
                <>
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    type="button"
                    disabled={isSubmitting}
                  >
                    上一步
                  </Button>
                  <Button
                    onClick={handleFinalSubmit}
                    type="button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? '發佈中...' : '確認發佈'}
                  </Button>
                </>
              )}
            </div>
          </div>
          <aside className="hidden lg:block lg:w-5/12 xl:w-1/3 mt-10 lg:mt-0">
            <div className="space-y-6 sticky top-10">
              <LivePreviewCard
                formData={previewFormData}
                typeOptions={typeOptions}
                locationOptions={locationOptions}
                coverPreview={previewCover}
              />
              {currentStep === 'step2' /* ... tip cards ... */ && (
                <Card className="shadow-lg bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-50 border border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold flex items-center text-sky-600 dark:text-sky-400">
                      <span className="text-xl mr-2">💡</span> 發佈後小提醒
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                    <p>✓ 揪團發佈後，您可以在「我的揪團」頁面管理。</p>
                    <p>✓ 記得將揪團連結分享給朋友或相關社群！</p>
                    <p>✓ 留意系統通知，即時掌握報名與留言互動。</p>
                  </CardContent>
                </Card>
              )}
              <Card className="bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-500/70 shadow-md">
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center text-red-600 dark:text-red-300">
                    <span className="text-xl mr-2">⚠️</span> 注意事項
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-red-700 dark:text-red-300/90 space-y-1">
                  <p>• 請確保揪團資訊真實、準確，避免誤導。</p>
                  <p>• 禁止發佈任何違反平台社群守則的內容。</p>
                  <p>• 揪團涉及費用時，請明確說明收退款規則。</p>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
=======
    <main className="min-h-screen bg-slate-50 p-6">
      <Tabs
        value={step}
        onValueChange={setStep}
        className="max-w-3xl mx-auto mb-8"
      >
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="step1">基本資訊</TabsTrigger>
          <TabsTrigger value="step2">確認 & 發佈</TabsTrigger>
        </TabsList>
      </Tabs>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-10">
        {step === 'step1' && (
          <Card className="p-8 space-y-6">
            <h2 className="text-lg font-semibold">基本資訊</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 活動類型 */}
              <div>
                <Label>活動類型</Label>
                <select
                  className="w-full border p-2 rounded"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  {typeOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 標題 */}
              <div>
                <Label htmlFor="title">揪團標題</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例如：北海道雙板初學團"
                />
              </div>

              {/* 日期 */}
              <div>
                <Label htmlFor="start_date">開始日期</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="end_date">結束日期</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              {/* 活動地點（只有 SKI 顯示下拉，MEAL 顯示文字輸入） */}
              <div className="md:col-span-2">
                <Label>活動地點</Label>
                {type === '滑雪' ? (
                  <select
                    className="w-full border p-2 rounded"
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                  >
                    <option value="" disabled>
                      請選擇滑雪場
                    </option>
                    {locationOptions.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    placeholder="請輸入餐廳地址"
                  />
                )}
              </div>

              {/* 人數 */}
              <div>
                <Label htmlFor="min_people">最少人數</Label>
                <Input
                  id="min_people"
                  type="number"
                  min={1}
                  value={minPeople}
                  onChange={(e) => setMinPeople(+e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="max_people">最多人數</Label>
                <Input
                  id="max_people"
                  type="number"
                  min={1}
                  value={maxPeople}
                  onChange={(e) => setMaxPeople(+e.target.value)}
                />
              </div>

              {/* 費用 */}
              <div className="md:col-span-2">
                <Label htmlFor="price">費用 (每人 TWD)</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(+e.target.value)}
                />
              </div>

              {/* 新手開啟 */}
              <div className="md:col-span-2 flex items-center space-x-4">
                <Label>歡迎新手參加</Label>
                <Switch
                  checked={allowNewbie}
                  onCheckedChange={setAllowNewbie}
                />
              </div>

              {/* 描述 */}
              <div className="md:col-span-2">
                <Label htmlFor="description">活動描述</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="請輸入活動詳情與注意事項"
                />
              </div>

              {/* 封面 */}
              <div className="md:col-span-2">
                <Label>封面圖片上傳</Label>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current.click()}
                  className="flex h-52 cursor-pointer flex-col items-center justify-center border-2 border-dashed border-slate-300 bg-sky-50/40 hover:border-sky-500"
                >
                  {coverPreview ? (
                    <div
                      className="h-full w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${coverPreview})` }}
                    />
                  ) : (
                    <p className="text-slate-400">拖曳或點擊上傳封面圖片</p>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={handleCancel}>
                放棄
              </Button>
              <Button onClick={() => setStep('step2')}>下一步</Button>
            </div>
          </Card>
        )}

        {step === 'step2' && (
          <Card className="p-8 space-y-4">
            <h2 className="text-lg font-semibold">確認 & 發佈</h2>
            <div className="space-y-2">
              <p>類型：{typeOptions.find((o) => o.value === type)?.label}</p>
              <p>標題：{title}</p>
              <p>
                日期：{startDate} ~ {endDate}
              </p>
              <p>
                地點：
                {type === '滑雪'
                  ? locationOptions.find((l) => String(l.id) === locationId)
                      ?.name
                  : customLocation}
              </p>
              <p>
                人數：{minPeople} - {maxPeople} 人
              </p>
              <p>費用：NT$ {price}</p>
              <p>新手：{allowNewbie ? '允許' : '不允許'}</p>
              <p>描述：{description}</p>
              {coverPreview && (
                <img
                  src={coverPreview}
                  alt="封面預覽"
                  className="w-full h-40 object-cover rounded"
                />
              )}
            </div>
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setStep('step1')}>
                上一步
              </Button>
              <Button type="submit">發布</Button>
            </div>
          </Card>
        )}
      </form>
>>>>>>> 318e321f242dec24a9b5abd3cc1a5a6b0377536c
    </main>
  );
}
