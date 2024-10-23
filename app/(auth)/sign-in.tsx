import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '@/constants'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import { getCurrentUser, signIn } from '@/lib/appwrite'
import { useGlobalContext } from '@/context/GlobalProvider'

const SignIn = () => {
  
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {setUser, setIsLogged} = useGlobalContext();
  
  const submit = async () => {

    if(!form.email || !form.password){
      Alert.alert('Error', 'Please fill in all the fields.')
    }

    setIsSubmitting(true);

    try {
      await signIn(form.email, form.password)
      
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);
      
      router.replace('/tabs/home');
    }catch(error:any){
      Alert.alert('Error', error.message)
    }finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView
      className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-center min-h-[84vh] px-4 my-6'>
        {/* min-h-[85vh] */}
          <Image
          source={images.logo}
          resizeMode='contain'
          className='w-[115px] h-[35px]' />
          <Text className='text-2xl text-white text-semibold mt-10 font-psemibold'>
            Log in to Aora
          </Text>
          <FormField
            title="Email"
            value={form.email}
            handleChangeText = {(e:any)=>{setForm({
              ...form,
              email: e
            })}}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText = {(e:any)=>{setForm({
              ...form,
              password: e
            })}}
            otherStyles="mt-7"
          />
          <CustomButton
          className=""
          title="Sign In"
          handlePress={submit}
          containerStyles={"mt-7"}
          isLoading={isSubmitting}
           />
          <View className='pt-5 flex-row justify-center gap-2'>
            <Text className='text-gray-100 text-lg'>Don't have an account?</Text>
            <Link href={'/sign-up'} className=' text-secondary text-center text-lg'>Sign Up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn