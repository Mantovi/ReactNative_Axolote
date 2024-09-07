import { DarkTheme, DefaultTheme, ThemeProvider, NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    'PressStart2P': require('../assets/fonts/PressStart2P-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="index"
          options={{
            title: "Seja bem vindo"
          }}
        />
        <Stack.Screen
        name='AxolotListColor'
        options={{
          title: "Listagem de cores dos Axolotes"
        }}
        />
        <Stack.Screen
          name='AxolotList'
          options={{
            title: "Listagem de axolotes"
          }}
        />
        <Stack.Screen
          name='initialPage'
          options={{
            title: "Axolote"
          }}
        />
        <Stack.Screen
          name='namePage'
          options={{
            title: "QualSeuNome"
          }}
        />
        <Stack.Screen
          name='MemoryGame'
          options={{
            title: "jogoDaMemoria"
          }}
        />
        {/*<Stack.Screen
          name='NativeGame'
          options={{
            title: "jogoNativo"
          }}
        />*/}
      </Stack>
    </ThemeProvider>
  );
}
