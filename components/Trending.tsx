import {FlatList, Image } from 'react-native'
import React, { useCallback, useState } from 'react'
import * as Animatiable from 'react-native-animatable';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { icons } from '@/constants';
import { ResizeMode, Video } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';

const Trending = ({posts}:any) => {
  const [activeItem, setActiveItem] = useState(posts[1]);
  const {query} = useLocalSearchParams();

  // const viewableItemChanged = useCallback(
  //   ({viewableItems}:any) => {
  //     setActiveItem(viewableItems[0].key)
  // },[])

  const viewableItemChanged = useCallback(({ viewableItems }:any) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  },[]);


  return (
    <>
    <FlatList
    data={posts}
    keyExtractor={(item:any)=>item.$id}
    showsHorizontalScrollIndicator={false}
    renderItem={({item,index})=>(
        <TrendingItem activeItem={activeItem} item={item} />
    )}
    onViewableItemsChanged={viewableItemChanged}
    viewabilityConfig={{
      itemVisiblePercentThreshold: 75
    }}
    horizontal
    />
    </>
  )
}

// animation

const zoomIn = {
  0: {scale: 0.9},
  1:{scale: 1.1},
}

const zoomOut = {
  0: {scale: 1},
  1:{scale: 0.9},
}

const TrendingItem = ({activeItem, item}:any) =>{
  const [play, setPlay] = useState(false);
  

  return(
    <Animatiable.View 
      className='mr-5'
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}>
      {
        play ? (
          <Video
          source={{uri: item.video}}
          className='w-52 h-72 rounded-lg mt-3 bg-white/10'
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay={play}
          onPlaybackStatusUpdate={(status:any)=>{
            if(status.didJustFinish){
              setPlay(false);
            }
          }} />
        ) : (
          <TouchableOpacity
          className='relative justify-center items-center' activeOpacity={0.7}
          onPress={()=>setPlay(true)}>
            <Image
            source={{uri: item.thumbnail}}
            className='w-52 h-72 rounded-lg my-5 overflow-hidden shadow-lg shadow-black/40' />
            <Image
              source={icons.play}
              className='w-12 h-12 absolute rounded-xl mt-3'
              resizeMode='cover' />
          </TouchableOpacity>
        )
      }
    </Animatiable.View>
  )
}

export default Trending