import { useState } from 'react'
import { Button, Checkbox, Input, Label, Text, XStack, YStack } from 'tamagui'

export default function LoginRegister() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  return (
    <YStack f={1} jc="center" ai="center" bg="#fff" p="$4" space>
      {/* Logo */}
      <Text fontSize={36} fontWeight="bold" color="#FF2D7A" mb="$4">WE{'\n'}OUT</Text>

      {/* Sign in title */}
      <Text fontSize={24} fontWeight="600" mb="$2">Sign in</Text>

      {/* Email input */}
      <Input
        placeholder="Your mail/Username"
        value={email}
        onChangeText={setEmail}
        width={260}
        mb="$2"
      />

      {/* Password input */}
      <Input
        placeholder="Your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        width={260}
        mb="$2"
      />

      {/* Remember me & Forgot password */}
      <XStack jc="space-between" ai="center" width={260} mb="$2">
        <XStack ai="center">
          <Checkbox checked={remember} onCheckedChange={setRemember} id="remember" mr="$1" />
          <Label htmlFor="remember" fontSize={14}>Remember Me</Label>
        </XStack>
        <Text fontSize={14} color="#888">Forgot Password?</Text>
      </XStack>

      {/* Sign in button */}
      <Button width={260} bg="#FF2D7A" color="#fff" fontWeight="bold" fontSize={16} mb="$2">
        SIGN IN
      </Button>

      {/* OR */}
      <Text color="#888" mb="$2">OR</Text>

      {/* Social logins */}
      <Button width={260} bg="#fff" borderColor="#ddd" borderWidth={1} color="#222" mb="$2">
        Login with Google
      </Button>
      <Button width={260} bg="#fff" borderColor="#ddd" borderWidth={1} color="#222" mb="$2">
        Login with Facebook
      </Button>

      {/* Register link */}
      <XStack jc="center" mt="$2">
        <Text color="#888">Don’t have an account yet? </Text>
        <Text color="#FF2D7A" fontWeight="bold">Sign up</Text>
      </XStack>
    </YStack>
  )
}
