import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Test connection function
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('players').select('count').limit(1)
    if (error) {
      console.error('Supabase connection error:', error)
      return false
    }
    console.log('✅ Supabase connected successfully')
    return true
  } catch (error) {
    console.error('❌ Supabase connection failed:', error)
    return false
  }
}

// Auth helper functions
export const auth = {
  // Sign up new user
  signUp: async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        }
      }
    })
    return { data, error }
  },

  // Sign in user
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out user
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Get current session
  getCurrentSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  }
}

// Character helper functions
export const characters = {
  // Create new character
  create: async (characterData: {
    name: string
    sect: string
    playerId: string
    stats: any
    resources: any
  }) => {
    const { data, error } = await supabase
      .from('characters')
      .insert([{
        player_id: characterData.playerId,
        name: characterData.name,
        sect: characterData.sect,
        level: characterData.resources.level,
        experience: characterData.resources.experience, // Keep original field name
        realm: characterData.resources.realm,
        realm_progress: characterData.resources.realmProgress,

        // Stats
        attack: characterData.stats.attack,
        defense: characterData.stats.defense,
        speed: characterData.stats.speed,
        critical_rate: characterData.stats.criticalRate,

        // Resources
        health: characterData.resources.health,
        max_health: characterData.resources.maxHealth,
        mana: characterData.resources.mana,
        max_mana: characterData.resources.maxMana,

        // Currency
        gold: characterData.resources.gold,
        spirit_stones: characterData.resources.spiritStones,

        // Original cultivation fields (keep for compatibility)
        cultivation_points: characterData.resources.cultivationPoints || 0,
        cultivation_speed: characterData.resources.cultivationSpeed || 1.0,
        last_cultivation_time: new Date().toISOString(),

        // New cultivation fields
        current_cultivation_points: 0,
        total_cultivation_time: 0,
        last_cultivation_check: new Date().toISOString(),
        cultivation_session_start: null,
        cultivation_session_duration: 0,
        is_cultivating: false,
        offline_cultivation_bonus: 0.5,

        // Experience (new fields)
        total_experience: 0,
        experience_to_next_level: 100,
        experience_sources: {}
      }])
      .select()
      .single()

    return { data, error }
  },

  // Get characters by player ID
  getByPlayerId: async (playerId: string) => {
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('player_id', playerId)
      .order('created_at', { ascending: false })

    return { data, error }
  },

  // Get character by ID
  getById: async (characterId: string) => {
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('id', characterId)
      .single()

    return { data, error }
  },

  // Update character
  update: async (characterId: string, updates: any) => {
    const { data, error } = await supabase
      .from('characters')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', characterId)
      .select()
      .single()

    return { data, error }
  },

  // Delete character
  delete: async (characterId: string) => {
    const { error } = await supabase
      .from('characters')
      .delete()
      .eq('id', characterId)

    return { error }
  },

  // Check if character name exists
  checkNameExists: async (name: string, excludeId?: string) => {
    let query = supabase
      .from('characters')
      .select('id')
      .eq('name', name)

    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data, error } = await query

    if (error) return { exists: false, error }
    return { exists: data && data.length > 0, error: null }
  },

  // Update character cultivation data
  updateCultivation: async (characterId: string, updates: {
    current_cultivation_points?: number
    total_cultivation_time?: number
    is_cultivating?: boolean
    cultivation_session_start?: string | null
    last_cultivation_check?: string
  }) => {
    const { data, error } = await supabase
      .from('characters')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', characterId)
      .select()
      .single()

    return { data, error }
  }
}

// Player helper functions
export const players = {
  // Create or update player profile
  upsert: async (userId: string, userData: {
    email: string
    username: string
    avatar?: string
  }) => {
    const { data, error } = await supabase
      .from('players')
      .upsert([{
        id: userId,
        email: userData.email,
        username: userData.username,
        avatar: userData.avatar,
        last_login: new Date().toISOString()
      }])
      .select()
      .single()

    return { data, error }
  },

  // Get player by ID
  getById: async (playerId: string) => {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', playerId)
      .single()

    return { data, error }
  }
}
