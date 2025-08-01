import { defineConfig } from 'vite' // ✅ correct function name (all lowercase)
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/FlightBooking-react/'
})

