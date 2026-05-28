// 'use client';

// import { AdminProvider } from '@/contexts/AdminContext';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState, useRef } from 'react';

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';

// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import Link from 'next/link';
// import {
//   User,
//   Mail,
//   Phone,
//   AlertCircle,
//   CheckCircle2,
//   Loader2,
//   Pencil,
//   Lock,
//   X,
//   Camera
// } from 'lucide-react';

// // import { tokenStorage } from "@/utils/token";
// import { profile, updateProfile } from '@/services/auth.service';

// import { I18nContext } from '@/i18n/provider';
// import { LANGUAGES, Language } from '@/i18n/languages';
// import { useTranslation } from '@/hooks/useTranslation';

// import { AppMessage } from '@/components/common/AppMessage';
// import { useAppMessage } from '@/hooks/ui/useAppMessage';

// function ProfileContent() {
//   const router = useRouter();
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   // const [success, setSuccess] = useState(false);
//   // const [error, setError] = useState('');

//   const { message, type, visible, showMessage, clearMessage } = useAppMessage();


//   const [avatar, setAvatar] = useState<string | null>(null);
//   const [profileImage, setProfileImage] = useState<File | null>(null);

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phoneCode: '',
//     phoneNumber: '',
//     role: '',
//     status: '',
//   });


//   useEffect(() => {
//     // const savedLang = localStorage.getItem('lang') || 'en';
//     const fetchProfile = async () => {
//       setIsLoading(true);
//       try {
//         const res = await profile(); // your API call
//         const profileData = res.data;

//         setFormData({
//           name: profileData?.name ?? '',
//           email: profileData?.email ?? '',
//           phoneCode: profileData.phoneCode ?? '',
//           phoneNumber: profileData?.phoneNumber ?? '',
//           role: profileData?.role?.name ?? '',
//           status: profileData?.status ?? '',
//         });

//         setAvatar(profileData?.photo ?? null);
//         // console.log("Profile Response on AdminLayout ::  " + JSON.stringify(res));
//       } catch (err: any) {
//         console.error(err);
//         // setError(err.message || "Failed to load profile");
//         showMessage(
//           err.message || "Failed to load profile",
//           'danger'
//         );
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchProfile();
//   }, []);

//   const handleSubmit = async (
//     e: React.FormEvent
//   ) => {

//     e.preventDefault();

//     setIsLoading(true);

//     try {

//       const payload = new FormData();

//       payload.append('name', formData.name);
//       payload.append('phoneCode', formData.phoneCode);
//       payload.append('phoneNumber', formData.phoneNumber);

//       /**
//        * Upload image
//        */
//       if (profileImage) {
//         payload.append('photo', profileImage);
//       }

//       /**
//        * API call
//        */
//       const res = await updateProfile(payload);

//       const updatedUser = res.data;

//       /**
//        * Update local state
//        */
//       setFormData((prev) => ({
//         ...prev,
//         name: updatedUser?.name ?? '',
//         email: updatedUser?.email ?? '',
//         phoneCode: updatedUser?.phoneCode ?? '',
//         phoneNumber: updatedUser?.phoneNumber ?? '',
//         role: updatedUser?.role?.name ?? prev.role,
//         status: updatedUser?.status ?? prev.status,
//       }));

//       /**
//        * Update avatar
//        */
//       setAvatar(updatedUser?.photo ?? avatar);

//       /**
//        * SAVE UPDATED PROFILE GLOBALLY
//        */
//       // localStorage.setItem(
//       //   'profileData',
//       //   JSON.stringify(updatedUser)
//       // );

//       /**
//        * NOTIFY HEADER / LAYOUT
//        */
//       window.dispatchEvent(
//         new Event('profile-updated')
//       );

//       // setSuccess(true);
//       showMessage(
//         `Profile updated successfully`,
//         'success'
//       );

//       setIsEditing(false);

//     } catch (err: any) {

//       console.error(err);

//       showMessage(
//         err?.message ||
//         'Failed to update profile.',
//         'danger'
//       );


//     } finally {

//       setIsLoading(false);
//     }
//   };


//   const handleCancel = () => {
//     setIsEditing(false);
//   };

//   const handleImageUpload = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = event.target.files?.[0];

//     if (!file) return;

//     // store actual file
//     setProfileImage(file);

//     // preview image
//     const preview = URL.createObjectURL(file);
//     setAvatar(preview);
//   };

//   return (
//     <div className="max-w-2xl mx-auto space-y-6">
//       <Card className="border-border/60 shadow-sm">
//         <CardHeader className="border-b border-border/40 bg-muted/20">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <User className="w-7 h-7 text-primary" />
//               <CardTitle className="text-xl font-medium">
//                 Profile Information
//               </CardTitle>
//             </div>

//             <div className="flex gap-2">
//               {!isEditing && (

//                 <Button className="gap-2 bg-accent hover:bg-aaccent/70 w-full md:w-auto" onClick={() => setIsEditing(true)}>
//                   <Pencil className="w-4 h-4" />
//                   Edit Profile
//                 </Button>
//               )}

//               <Link href="/root/change-password">
//                 <Button className="gap-2 bg-primary hover:bg-primary/90 w-full md:w-auto">
//                   <Lock className="w-4 h-4" />
//                   Change Password
//                 </Button>
//               </Link>


//             </div>
//           </div>

//           <CardDescription>
//             Manage your account information
//           </CardDescription>
//         </CardHeader>

//         <CardContent className="pt-6">
//           <form onSubmit={handleSubmit} className="space-y-6">

//             {/* Profile Image */}
//             <div className="flex justify-center">
//               <div className="relative">

//                 <div className="w-24 h-24 rounded-xl overflow-hidden border bg-muted flex items-center justify-center">
//                   {avatar ? (
//                     <img
//                       src={avatar}
//                       alt="profile"
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <User className="w-10 h-10 text-muted-foreground" />
//                   )}
//                 </div>

//                 {isEditing && (
//                   <>
//                     <button
//                       type="button"
//                       onClick={() => fileInputRef.current?.click()}
//                       className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-md hover:bg-primary/90"
//                     >
//                       <Camera className="w-4 h-4" />
//                     </button>

//                     <input
//                       type="file"
//                       ref={fileInputRef}
//                       className="hidden"
//                       accept="image/*"
//                       onChange={handleImageUpload}
//                     />
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* {error && (
//               <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-center gap-3">
//                 <AlertCircle className="w-5 h-5" />
//                 <p className="text-sm font-medium">{error}</p>
//               </div>
//             )}

//             {success && (
//               <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-4 py-3 rounded-lg flex items-center gap-3">
//                 <CheckCircle2 className="w-5 h-5" />
//                 <p className="text-sm font-medium">
//                   Profile updated successfully!
//                 </p>
//               </div>
//             )} */}

//             {/* Name */}
//             <div className="space-y-2">
//               <Label>Full Name</Label>

//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

//                 <Input
//                   required
//                   disabled={!isEditing}
//                   value={formData.name}
//                   onChange={(e) =>
//                     setFormData({ ...formData, name: e.target.value })
//                   }
//                   className="pl-9 bg-muted/30"
//                 />
//               </div>
//             </div>

//             {/* Email */}
//             <div className="space-y-2">
//               <Label>Email</Label>

//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

//                 <Input
//                   disabled
//                   value={formData.email}
//                   className="pl-9 bg-muted/30"
//                 />
//               </div>
//             </div>

//             {/* Phone */}
//             <div className="space-y-2">
//               <Label>Phone Number</Label>

//               <div className="flex gap-2">

//                 {/* Phone Code */}
//                 <Select
//                 required
//                   disabled={!isEditing}
//                   value={formData.phoneCode}
//                   onValueChange={(value) =>
//                     setFormData({
//                       ...formData,
//                       phoneCode: value,
//                     })
//                   }
//                 >
//                   <SelectTrigger className="w-[120px] bg-muted/30">
//                     <SelectValue placeholder="+91" />
//                   </SelectTrigger>

//                   <SelectContent>
//                     <SelectItem value="+91">🇮🇳 +91</SelectItem>
//                     <SelectItem value="+1">🇺🇸 +1</SelectItem>
//                     <SelectItem value="+44">🇬🇧 +44</SelectItem>
//                     <SelectItem value="+61">🇦🇺 +61</SelectItem>
//                     <SelectItem value="+971">🇦🇪 +971</SelectItem>
//                   </SelectContent>
//                 </Select>

//                 {/* Phone Number */}
//                 <div className="relative flex-1">
//                   <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

//                   <Input
//                   required
//                     disabled={!isEditing}
//                     value={formData.phoneNumber}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         phoneNumber: e.target.value,
//                       })
//                     }
//                     className="pl-9 bg-muted/30"
//                     placeholder="Enter phone number"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Role */}
//             <div className="space-y-2">
//               <Label>Role</Label>
//               <Input value={formData.role} disabled className="bg-muted/30" />
//             </div>

//             {/* Status */}
//             <div className="space-y-2">
//               <Label>Status</Label>
//               <Input value={formData.status} disabled className="bg-muted/30" />
//             </div>

//             {isEditing && (
//               <div className="flex gap-3 pt-2">
//                 <Button type="submit" disabled={isLoading}>
//                   {isLoading ? (
//                     <>
//                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                       Saving...
//                     </>
//                   ) : (
//                     'Save Changes'
//                   )}
//                 </Button>

//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={handleCancel}
//                 >
//                   <X className="w-4 h-4 mr-1" />
//                   Cancel
//                 </Button>
//               </div>
//             )}
//           </form>
//         </CardContent>
//       </Card>


//       {/* RIGHT SIDE RESPONSE MESSAGE */}
//       <AppMessage
//         visible={visible}
//         message={message}
//         type={type}
//         onClose={clearMessage}
//       />
//     </div>
//   );
// }

// export default function ProfilePage() {
//   return (
//     <AdminProvider>
//       <ProfileContent />
//     </AdminProvider>
//   );
// }


// Translated Code 

'use client'

import { AdminProvider, useAdmin } from '@/contexts/AdminContext';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import Link from 'next/link';

import {
  User,
  Mail,
  Phone,
  Loader2,
  Pencil,
  Lock,
  X,
  Camera,
} from 'lucide-react';

import {
  profile,
  updateProfile,
} from '@/services/auth.service';

import { AppMessage } from '@/components/common/AppMessage';
import { useAppMessage } from '@/hooks/ui/useAppMessage';

export default function ProfileContent() {

  const router = useRouter();
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const { t } = useAdmin();

  const [isEditing, setIsEditing] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const {
    message,
    type,
    visible,
    showMessage,
    clearMessage,
  } = useAppMessage();

  const [avatar, setAvatar] =
    useState<string | null>(null);

  const [profileImage, setProfileImage] =
    useState<File | null>(null);

  const [formData, setFormData] =
    useState({
      name: '',
      email: '',
      phoneCode: '',
      phoneNumber: '',
      role: '',
      status: '',
    });

  /* ================= FETCH PROFILE ================= */

  // useEffect(() => {

  //   const fetchProfile = async () => {

  //     setIsLoading(true);

  //     try {

  //       const res = await profile();

  //       const profileData = res.data;

  //       setFormData({
  //         name: profileData?.name ?? '',
  //         email: profileData?.email ?? '',
  //         phoneCode:
  //           profileData?.phoneCode ?? '',
  //         phoneNumber:
  //           profileData?.phoneNumber ?? '',
  //         role:
  //           profileData?.role?.name ?? '',
  //         status:
  //           profileData?.status ?? '',
  //       });

  //       setAvatar(
  //         profileData?.photo ?? null
  //       );

  //     } catch (err: any) {

  //       console.error(err);

  //       showMessage(
  //         err.message ||
  //         t('translate.LOAD_PROFILE_FAILED'),
  //         'danger'
  //       );

  //     } finally {

  //       setIsLoading(false);
  //     }
  //   };

  //   fetchProfile();

  // }, []);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await profile();

      const profileData = res.data;

      setFormData({
        name: profileData?.name ?? '',
        email: profileData?.email ?? '',
        phoneCode:
          profileData?.phoneCode ?? '',
        phoneNumber:
          profileData?.phoneNumber ?? '',
        role:
          profileData?.role?.name ?? '',
        status:
          profileData?.status ?? '',
      });

      setAvatar(
        profileData?.photo ?? null
      );
    } catch (err: any) {
      console.error(err);

      showMessage(
        err.message ||
        t('translate.load_profile_failed'),
        'danger'
      );
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);


  /* ================= SUBMIT ================= */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setIsLoading(true);

    try {

      const payload = new FormData();

      payload.append(
        'name',
        formData.name
      );

      payload.append(
        'phoneCode',
        formData.phoneCode
      );

      payload.append(
        'phoneNumber',
        formData.phoneNumber
      );

      if (profileImage) {
        payload.append(
          'photo',
          profileImage
        );
      }

      const res =
        await updateProfile(payload);

      const updatedUser = res.data;

      setFormData((prev) => ({
        ...prev,
        name:
          updatedUser?.name ?? '',
        email:
          updatedUser?.email ?? '',
        phoneCode:
          updatedUser?.phoneCode ?? '',
        phoneNumber:
          updatedUser?.phoneNumber ?? '',
        role:
          updatedUser?.role?.name ??
          prev.role,
        status:
          updatedUser?.status ??
          prev.status,
      }));

      setAvatar(
        updatedUser?.photo ?? avatar
      );

      window.dispatchEvent(
        new Event('profile-updated')
      );

      showMessage(
        t('translate.PROFILE_UPDATED'),
        'success'
      );

      setIsEditing(false);

    } catch (err: any) {

      console.error(err);

      showMessage(
        err?.message ||
        t('translate.UPDATE_PROFILE_FAILED'),
        'danger'
      );

    } finally {

      setIsLoading(false);
    }
  };

  /* ================= CANCEL ================= */

  const handleCancel = () => {
    setIsEditing(false);
  };

  /* ================= IMAGE ================= */

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      event.target.files?.[0];

    if (!file) return;

    setProfileImage(file);

    const preview =
      URL.createObjectURL(file);

    setAvatar(preview);
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="border-b border-border/40 bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-7 h-7 text-primary" />

              <CardTitle className="text-xl font-medium">
                {t('translate.profile_information')}
              </CardTitle>
            </div>

            <div className="flex gap-2">
              {!isEditing && (
                <Button
                  className="gap-2 bg-accent hover:bg-aaccent/70 w-full md:w-auto"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="w-4 h-4" />

                  {t('translate.edit_profile')}
                </Button>
              )}

              <Link href="/root/change-password">
                <Button className="gap-2 bg-primary hover:bg-primary/90 w-full md:w-auto">
                  <Lock className="w-4 h-4" />

                  {t('translate.change_password')}
                </Button>
              </Link>
            </div>
          </div>

          <CardDescription>
            {t('translate.manage_account')}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* PROFILE IMAGE */}

            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-xl overflow-hidden border bg-muted flex items-center justify-center">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>

                {isEditing && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-md hover:bg-primary/90"
                    >
                      <Camera className="w-4 h-4" />
                    </button>

                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </>
                )}
              </div>
            </div>

            {/* FULL NAME */}

            <div className="space-y-2">
              <Label>
                {t('translate.full_name')}
              </Label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                <Input
                  required
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className="pl-9 bg-muted/30"
                />
              </div>
            </div>

            {/* EMAIL */}

            <div className="space-y-2">
              <Label>
                {t('translate.email')}
              </Label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                <Input
                  disabled
                  value={formData.email}
                  className="pl-9 bg-muted/30"
                />
              </div>
            </div>

            {/* PHONE */}

            <div className="space-y-2">
              <Label>
                {t('translate.phone_number')}
              </Label>

              <div className="flex gap-2">
                <Select
                  required
                  disabled={!isEditing}
                  value={formData.phoneCode}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      phoneCode: value,
                    })
                  }
                >
                  <SelectTrigger className="w-[120px] bg-muted/30">
                    <SelectValue placeholder="+91" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="+91">
                      🇮🇳 +91
                    </SelectItem>

                    <SelectItem value="+1">
                      🇺🇸 +1
                    </SelectItem>

                    <SelectItem value="+44">
                      🇬🇧 +44
                    </SelectItem>

                    <SelectItem value="+61">
                      🇦🇺 +61
                    </SelectItem>

                    <SelectItem value="+971">
                      🇦🇪 +971
                    </SelectItem>
                  </SelectContent>
                </Select>

                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                  <Input
                    required
                    disabled={!isEditing}
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phoneNumber: e.target.value,
                      })
                    }
                    className="pl-9 bg-muted/30"
                    placeholder={t(
                      'translate.enter_phone_number'
                    )}
                  />
                </div>
              </div>
            </div>

            {/* ROLE */}

            <div className="space-y-2">
              <Label>
                {t('translate.role')}
              </Label>

              <Input
                value={formData.role}
                disabled
                className="bg-muted/30"
              />
            </div>

            {/* STATUS */}

            <div className="space-y-2">
              <Label>
                {t('translate.status')}
              </Label>

              <Input
                value={formData.status}
                disabled
                className="bg-muted/30"
              />
            </div>

            {/* ACTIONS */}

            {isEditing && (
              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />

                      {t('translate.saving')}
                    </>
                  ) : (
                    t('translate.save_changes')
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                >
                  <X className="w-4 h-4 mr-1" />

                  {t('translate.cancel')}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      <AppMessage
        visible={visible}
        message={message}
        type={type}
        onClose={clearMessage}
      />
    </div>
  );
}
