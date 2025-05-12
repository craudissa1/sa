export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          nome_completo: string
          idioma: string
          tema_visual: string
          created_at: string
          updated_at?: string
        }
        Insert: {
          id: string
          nome_completo: string
          idioma: string
          tema_visual: string
          created_at: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome_completo?: string
          idioma?: string
          tema_visual?: string
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description?: string
          status: string
          due_date?: string
          created_at: string
          updated_at?: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string
          status: string
          due_date?: string
          created_at: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          status?: string
          due_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      time_blocks: {
        Row: {
          id: string
          user_id: string
          start_time: string
          end_time: string
          activity_type: string
          description?: string
          created_at: string
          updated_at?: string
        }
        Insert: {
          id?: string
          user_id: string
          start_time: string
          end_time: string
          activity_type: string
          description?: string
          created_at: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          start_time?: string
          end_time?: string
          activity_type?: string
          description?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_configurations: {
        Row: {
          id: string
          user_id: string
          key: string
          value: Json
          created_at: string
          updated_at?: string
        }
        Insert: {
          id?: string
          user_id: string
          key: string
          value: Json
          created_at: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          key?: string
          value?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
