import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import {icons } from "../../constants";

const TabIcon = ({icon, color, focused, name}:any) => {
  return (
    <View className=' flex justify-center items-center gap-2'>
      <Image
        source={icon}
        resizeMode='contain'
        tintColor={color} 
        className='w-6 h-6' 
      />
      <Text 
      style={{
        color: color,
      }}
      className={` text-xs ${focused ? 'font-psemibold' : 'font-pregular'} `}>
        {name}
      </Text>
    </View>
  )
}

const TabLayout = () => {
  return (
    <>
      <Tabs 
      screenOptions={{
        tabBarShowLabel:false,
        tabBarActiveTintColor: '#FFA001',
        tabBarInactiveTintColor: '#CDCDE0',
        tabBarStyle: {
          backgroundColor: '#161622',
          borderTopWidth: 1,
          borderTopColor: '#232533',
          height: 84,
        }
      }}>
        <Tabs.Screen
          name='home'
          options={{
            headerShown: false,
            title: 'Home',
            tabBarIcon: ({color, focused}) => (
              <TabIcon 
                icon={icons.home}
                name='Home'
                color={color}
                focused={focused} />
            )
          }
        }
        />
        {/* <Tabs.Screen
          name='bookmark'
          options={{
            headerShown: false,
            title: 'Bookmark',
            tabBarIcon: ({color, focused}) => (
              <TabIcon 
                icon={icons.bookmark}
                name='Bookmark'
                color={color}
                focused={focused} />
            )
          }
        }
        /> */}
        <Tabs.Screen
          name='create'
          options={{
            headerShown: false,
            title: 'Create',
            tabBarIcon: ({color, focused}) => (
              <TabIcon 
              icon={icons.plus}
              name='Create'
              color={color}
              focused={focused} />
            )
          }
        }
        />
        <Tabs.Screen
          name='profile'
          options={{
            headerShown: false,
            title: 'Profile',
            tabBarIcon: ({color, focused}) => (
              <TabIcon 
              icon={icons.profile}
              name='Profile'
              color={color}
              focused={focused} />
            )
          }
        }
        />
      </Tabs>
    </>
  )
}

export default TabLayout