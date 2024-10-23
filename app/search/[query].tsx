import { View, Text, FlatList} from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '@/components/SearchInput'
import EmptyState from '@/components/EmptyState'
import { searchPosts } from '@/lib/appwrite'
import useAppwrite from '@/lib/useAppwrite'
import VideoCard from '@/components/VideoCard'
import { useLocalSearchParams } from 'expo-router'

const Search = () => {

  const { query } = useLocalSearchParams();
  const {data: posts=[], refetch} = useAppwrite(()=>searchPosts(query));
 
  useEffect(()=>{
    if(query){
      refetch()
    }
  },[query])


  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList
      data={posts ?? []}
      keyExtractor={(item: any, index: number) => item.$id+String(index)}
      renderItem={({item})=>(
        <VideoCard posts={item} />
      )}
      ListHeaderComponent={()=>(
        <View className='space-y-6 my-6 px-4'>
            <View>
              <Text className='font-psemibold text-gray-100'>Search Results</Text>
              <Text className='text-2xl font-psemibold text-white'>{query}</Text>
              <View className="mt-6 mb-8">
                <SearchInput initialQuery={query} refetch={refetch} />
              </View>
            </View>
        </View>
      )}
      ListEmptyComponent={()=>(
        <EmptyState
        title = "No video found."
        subTitle = "No video found from this search query."
         />
      )}
      />
    </SafeAreaView>
  )
}

export default Search