import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import { resolve } from "path"

dotenv.config({ path: resolve(process.cwd(), ".env") })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase credentials in .env")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupBuckets() {
  const buckets = [
    { name: "manuscripts", public: false },
    { name: "avatars", public: true },
  ]

  for (const bucket of buckets) {
    console.log(`🚀 Setting up bucket: ${bucket.name}...`)
    
    const { data, error } = await supabase.storage.createBucket(bucket.name, {
      public: bucket.public,
      fileSizeLimit: 52428800, // 50MB
    })

    if (error) {
      if (error.message.includes("already exists")) {
        console.log(`ℹ️ Bucket ${bucket.name} already exists.`)
      } else {
        console.error(`❌ Error creating bucket ${bucket.name}:`, error.message)
      }
    } else {
      console.log(`✅ Bucket ${bucket.name} created successfully.`)
    }
  }
}

async function main() {
  await setupBuckets()
}

main()
