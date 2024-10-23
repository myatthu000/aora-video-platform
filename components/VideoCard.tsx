import { View, Text, Image, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { icons } from '@/constants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ResizeMode, Video } from 'expo-av';


// users is creator of videos

const VideoCard = ({posts}: any) => {

    const styles = StyleSheet.create({
        videoLayout: {
            width: '100%',
            height: '15rem',
        }
    })

    const {title, thumbnail, video, users } = posts;
    const [play, setPlay] = useState(false);
    return (
        <View className="flex flex-col px-4 mb-14">
            <View className="flex-row justify-between gap-3 items-start">

                <View className="flex justify-center items-center flex-row flex-1">
                    <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
                        <Image
                            source={{ uri: users.avatar }}
                            className="w-full h-full rounded-lg"
                            resizeMode="cover"
                        />
                    </View>
        
                    <View className="flex justify-center flex-1 ml-3 gap-y-1">
                        <Text
                            className="font-psemibold text-sm text-white"
                            numberOfLines={1}
                        >
                            {title}
                        </Text>
                        <Text
                            className="text-xs text-gray-100 font-pregular"
                            numberOfLines={1}
                        >
                            {users.username}
                        </Text>
                    </View>
                </View>
        
                <View className="pt-2">
                    <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
                </View>
            </View>
            {
                play ? (
                    <View>
                        <Video
                        source={{uri: video}}
                        className=' w-full border border-secondary rounded-xl mt-3 '
                        resizeMode={ResizeMode.CONTAIN}
                        useNativeControls
                        shouldPlay
                        onPlaybackStatusUpdate={(status:any)=>{
                        if(status.didJustFinish){
                            setPlay(false);
                        }
                        }} />
                    </View>
                  ) : (
                    <TouchableOpacity 
                    activeOpacity={0.7}
                    onPress={()=> setPlay(true)}
                    className='w-full h-60 rounded-xl mt-3 relative justify-center items-center'>
                        <Image
                            source={thumbnail}
                            className='w-full h-full rounded-xl mt-3'
                            resizeMode='cover' />
                        <Image
                            source={icons.play}
                            className='w-12 h-12 absolute rounded-xl mt-3'
                            resizeMode='cover' />
                    </TouchableOpacity>
                )
            }

        </View>
    )
}

export default VideoCard