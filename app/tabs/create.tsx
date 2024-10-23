import { View, Text, Image, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '@/constants'
import FormField from '@/components/FormField'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ResizeMode, Video } from 'expo-av'
import CustomButton from '@/components/CustomButton'
import * as DocumentPicker from 'expo-document-picker'
// import * as ImagePicker from 'expo-image-picker'
import { createVideoPost } from '@/lib/appwrite'
import { useGlobalContext } from '@/context/GlobalProvider'
import { router } from 'expo-router'

const Create = () => {

  const {user} = useGlobalContext();
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    title: '',
    video: null,
    thumbnail: null,
    prompt: ''
  })

  const submit = async () => {
    console.log('form: ', form)
    if(!form.prompt || !form.thumbnail || !form.video || !form.thumbnail){
      console.log('error: ')
      return Alert.alert('Please fill in all the fields.')
    }

    setUploading(true)
    try {
      await createVideoPost({
        ...form, userId: user.$id
      })
      Alert.alert('Success','Post uploaded')
      router.push('/')
    } catch (error) {
      Alert.alert('Error','Post upload fail')
      // console.log('error: ', error)
      // throw new Error;
    }finally{
      setForm({
        title: '',
        video: null,
        thumbnail: null,
        prompt: '',
      })
      setUploading(false)
    }

  }

  const openPicker = async (selectType:any) => {


    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: selectType === 'image' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
    //   aspect: [4, 3],
    //   quality: 1,
    // });
    // console.log(result);

    const result = await DocumentPicker.getDocumentAsync({
      type:
        selectType === "image"
          ? ["image/png", "image/jpg","image/jpeg"]
          : ["video/mp4", "video/gif"],
    });
    console.log(result);
    

    if(!result.canceled){ 
      if(selectType === 'image'){
        setForm({ ...form, thumbnail: result.assets[0]})
      }

      if(selectType === 'video'){
        setForm({ ...form, video: result.assets[0]})
      }
    }else {
      setTimeout(()=>{
        Alert.alert('Document picked', JSON.stringify(result, null, 2))
      },100)
    }
  }


  return (
    <SafeAreaView className='bg-primary h-full px-4'>
      <ScrollView>
        <Text className='text-2xl font-psemibold my-6 text-white'>Upload Video</Text>
        <FormField
          title="Video Title"
          value={form.title}
          placeholder="Give your video a catch title ...."
          handleChangeText={(e:any)=>setForm({...form,title: e})}
          otherStyles={"mt-5"}
         />

        <View className='mt-7 space-y-2'>
          <Text className='text-base text-gray-100 font-pmedium'>Upload Video</Text>
        </View>
        <TouchableOpacity
        onPress={()=> openPicker('video')}>
          {
            form.video ? (
              <View className='w-full h-64 rounded-2xl flex justify-center items-center overflow-hidden'>
                <Video
                source={{uri: form.video}}
                className='w-full h-64'
                videoStyle={{width: '100%', height: '80%', display: 'flex' ,justifyContent: 'center', alignItems: 'center'}}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                />
              </View>
            ) : (
              <View className='w-full h-40 bg-black-100 rounded-2xl justify-center items-center'>
                <View className='w-14 h-14 border border-dashed border-secondary justify-center items-center'>
                  <Image
                  resizeMode='contain'
                  className='w-1/2 h-1/2'
                  source={icons.upload} />
                </View>
              </View>
            )
          }
        </TouchableOpacity>

        <View className='mt-7 space-y-2'>
          <Text className='text-base text-gray-100 font-pmedium'>Thumbnail Image</Text>
        </View>

        <TouchableOpacity 
        onPress={()=> openPicker('image')}>
        {
            form.thumbnail ? (
              <Image
              source={{uri: form.thumbnail?.uri}}
              className='w-full h-64 rounded-2xl'
              resizeMode={ResizeMode.COVER}
              />
            ) : (
              <View className='w-full h-16 bg-black-100 rounded-2xl flex-row justify-center items-center'>
                  <Image
                  resizeMode='contain'
                  className='w-5 h-5 mx-2'
                  source={icons.upload} />
                <Text className='text-sm text-center text-gray-100 font-psemibold'>Choose a file</Text>
              </View>
            )
          }
        </TouchableOpacity>
        <FormField
          title="AI Prompt"
          value={form.prompt}
          placeholder="The prompt you used to create this video ...."
          handleChangeText={(e:any)=>setForm({...form,prompt: e})}
          otherStyles={"mt-5"}
         />

         <CustomButton
         handlePress={submit}
         title="Submit & Publish"
         containerStyles="my-5 mt-7"
         />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Create