import { View, Text, TextInput, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { icons } from '@/constants';
import { router, usePathname } from 'expo-router';

const SearchInput = ({initialQuery}:any) => {
    
    const pathname = usePathname();
    const [query, setQuery] = useState(initialQuery || '');

  return (
    <View className={` space-y-2 `}>
      <View className='bordr-2 border-black-100 w-full h-16 px-4  bg-black-100 rounded-2xl
      focus:border-secondary items-center flex-row
      '>
        <TextInput
            className='flex-1 text-white font-psemibold text-base '
            value={query}
            placeholder={"Search for a video Topic"}
            placeholderTextColor={"#CDCDE0"}
            onChangeText={(e)=>setQuery(e)}
        />

        <TouchableOpacity
        onPress={()=>{
          if(query === ""){
            return Alert.alert('Missing query','Please input something to search results across database.')
          }
          if(pathname.startsWith('/search')) router.setParams({query});
          else router.push(`/search/${query}`);
        }}>
            <Image
            source={icons.search}
            className={'w-5 h-5'}
            resizeMode="contain"
            />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default SearchInput