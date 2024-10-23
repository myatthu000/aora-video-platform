import { View, Text, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import EmptyState from '@/components/EmptyState'
import { getAllPosts, getUserPosts, signOut } from '@/lib/appwrite'
import useAppwrite from '@/lib/useAppwrite'
import VideoCard from '@/components/VideoCard'
import { useGlobalContext } from '@/context/GlobalProvider'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { icons, images } from '@/constants'
import InfoBox from '@/components/InfoBox'
import { router } from 'expo-router'

const Profile = () => {

  const {user, setUser, setIsLogged} = useGlobalContext();
  const {data: posts, refetch} = useAppwrite(()=>getUserPosts(user.$id));  

  const logout = async()=>{
    await signOut()
    setUser(null)
    setIsLogged(false)
    router.replace('/sign-in')
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList
      data={posts ?? []}
      keyExtractor={(item:any)=>item.$id}
      renderItem={({item})=>(
        <VideoCard posts={item} />
      )}
      ListHeaderComponent={()=>(
        <View className='w-full flex justify-center items-center mt-6 mb-12 px-4'>
          <View
          className=' items-end mb-10 w-full'>
            <TouchableOpacity
              onPress={logout}
              >
                <Image
                  source={icons.logout}
                  className='w-6 h-6'
                  resizeMode='contain' />
            </TouchableOpacity>
          </View>

          <View className='w-16 h-16 border border-secondary rounded-lg justify-center items-center'>
            <Image
              source={user?.avatar}
              // defaultSource={images.profile}
              className='w-[90%] h-[90%] rounded-lg'
              resizeMode='cover'
              />
          </View>

          <InfoBox
              title={user?.username || 'Aora'}
              containerStyles='mt-5 mb-10'
              titleStyles="text-lg" />

          <View className='w-full justify-center flex-row'>
            <InfoBox
              title={posts.length || 0}
              subTitle="Posts"
              containerStyles='mr-5'
              titleStyles="text-xl text-center" />
            <InfoBox
              title={'1.2k'}
              subTitle="Followers"
              containerStyles=''
              titleStyles="text-xl text-center" />
          </View>
        </View>
      )}
      ListEmptyComponent={()=>(
        <EmptyState
        title = "No video found."
        subTitle = "Be the first one to upload video"
         />
      )}
      />
    </SafeAreaView>
  )
}

export default Profile