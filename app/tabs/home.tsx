import { View, Text, FlatList, Image, RefreshControl, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '@/constants'
import SearchInput from '@/components/SearchInput'
import Trending from '@/components/Trending'
import EmptyState from '@/components/EmptyState'
import { getAllPosts, getLatestPosts } from '@/lib/appwrite'
import useAppwrite from '@/lib/useAppwrite'
import VideoCard from '@/components/VideoCard'
import { useGlobalContext } from '@/context/GlobalProvider'

const Home = () => {

  const {data: posts, refetch} = useAppwrite(getAllPosts);
  const {data: latestPosts} = useAppwrite(getLatestPosts);
  const {user, setUser, setIsLogged } = useGlobalContext();
  

  const [refreshing, setRefreshing] = useState(false);
 

  const onRefresh = async () => {
    setRefreshing(true);
    // ... recall vid
    await refetch();
    setRefreshing(false);
  }


  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList
      data={posts}
      keyExtractor={(item:any)=>item.$id}
      renderItem={({item,index})=>(
        <VideoCard posts={item} />
        // <Text className='text-3xl text-white' key={index}>{item.title}</Text>
      )}
      ListHeaderComponent={()=>(
        <View className='space-y-6 my-6 px-4'>
          <View className='justify-between items-start flex-row mb-6 '>
            <View>
              <Text className='font-psemibold text-gray-100'>Welcome Back</Text>
              <Text className='text-2xl font-psemibold text-white'>{user?.username}</Text>
            </View>
            <View className='mt-1.5'>
              <Image
              source={images.logoSmall}
              resizeMode="contain"
              className="w-9 h-10" />
            </View>
          </View>
          
          <SearchInput />

          <View className='flex-1 w-full pt-5 pb-8'>
            <Text className='font-pregular text-gray-100 text-lg mb-3'>Latest Video</Text>
            <Trending 
            posts={latestPosts ?? []}
            />
          </View>
        </View>
      )}
      ListEmptyComponent={()=>(
        <EmptyState
        title = "No video found."
        subTitle = "Be the first one to upload video"
         />
      )}

      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  )
}

export default Home