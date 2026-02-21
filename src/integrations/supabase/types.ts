export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      game_moves: {
        Row: {
          created_at: string
          fen_after: string
          from_square: string
          game_id: string
          id: string
          move_number: number
          player_id: string | null
          san: string
          time_left: number | null
          to_square: string
        }
        Insert: {
          created_at?: string
          fen_after: string
          from_square: string
          game_id: string
          id?: string
          move_number: number
          player_id?: string | null
          san: string
          time_left?: number | null
          to_square: string
        }
        Update: {
          created_at?: string
          fen_after?: string
          from_square?: string
          game_id?: string
          id?: string
          move_number?: number
          player_id?: string | null
          san?: string
          time_left?: number | null
          to_square?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_moves_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_moves_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_moves_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          black_player_id: string | null
          black_time_left: number
          created_at: string
          current_turn: string
          draw_offer_from: string | null
          ended_at: string | null
          fen: string
          id: string
          increment: number
          initial_time: number
          last_chat: Json | null
          last_move_at: string | null
          original_game_id: string | null
          pgn: string | null
          ratings_processed: boolean | null
          rematch_game_id: string | null
          rematch_offer_from: string | null
          result: string | null
          result_reason: string | null
          started_at: string | null
          status: string
          time_control: string
          white_player_id: string | null
          white_time_left: number
          winner_id: string | null
        }
        Insert: {
          black_player_id?: string | null
          black_time_left?: number
          created_at?: string
          current_turn?: string
          draw_offer_from?: string | null
          ended_at?: string | null
          fen?: string
          id?: string
          increment?: number
          initial_time?: number
          last_chat?: Json | null
          last_move_at?: string | null
          original_game_id?: string | null
          pgn?: string | null
          ratings_processed?: boolean | null
          rematch_game_id?: string | null
          rematch_offer_from?: string | null
          result?: string | null
          result_reason?: string | null
          started_at?: string | null
          status?: string
          time_control?: string
          white_player_id?: string | null
          white_time_left?: number
          winner_id?: string | null
        }
        Update: {
          black_player_id?: string | null
          black_time_left?: number
          created_at?: string
          current_turn?: string
          draw_offer_from?: string | null
          ended_at?: string | null
          fen?: string
          id?: string
          increment?: number
          initial_time?: number
          last_chat?: Json | null
          last_move_at?: string | null
          original_game_id?: string | null
          pgn?: string | null
          ratings_processed?: boolean | null
          rematch_game_id?: string | null
          rematch_offer_from?: string | null
          result?: string | null
          result_reason?: string | null
          started_at?: string | null
          status?: string
          time_control?: string
          white_player_id?: string | null
          white_time_left?: number
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "games_black_player_id_fkey"
            columns: ["black_player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_black_player_id_fkey"
            columns: ["black_player_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_white_player_id_fkey"
            columns: ["white_player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_white_player_id_fkey"
            columns: ["white_player_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      matchmaking_queue: {
        Row: {
          created_at: string
          id: string
          increment: number
          initial_time: number
          last_heartbeat: string | null
          player_id: string
          rating: number
          rating_range: number
          time_control: string
        }
        Insert: {
          created_at?: string
          id?: string
          increment?: number
          initial_time: number
          last_heartbeat?: string | null
          player_id: string
          rating?: number
          rating_range?: number
          time_control: string
        }
        Update: {
          created_at?: string
          id?: string
          increment?: number
          initial_time?: number
          last_heartbeat?: string | null
          player_id?: string
          rating?: number
          rating_range?: number
          time_control?: string
        }
        Relationships: [
          {
            foreignKeyName: "matchmaking_queue_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matchmaking_queue_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          accuracy: number | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          draws: number | null
          id: string
          last_active_at: string | null
          losses: number | null
          puzzles_solved: number | null
          rating_blitz: number | null
          rating_classical: number | null
          rating_rapid: number | null
          streak_days: number | null
          total_games: number | null
          updated_at: string
          user_id: string
          username: string | null
          wins: number | null
        }
        Insert: {
          accuracy?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          draws?: number | null
          id?: string
          last_active_at?: string | null
          losses?: number | null
          puzzles_solved?: number | null
          rating_blitz?: number | null
          rating_classical?: number | null
          rating_rapid?: number | null
          streak_days?: number | null
          total_games?: number | null
          updated_at?: string
          user_id: string
          username?: string | null
          wins?: number | null
        }
        Update: {
          accuracy?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          draws?: number | null
          id?: string
          last_active_at?: string | null
          losses?: number | null
          puzzles_solved?: number | null
          rating_blitz?: number | null
          rating_classical?: number | null
          rating_rapid?: number | null
          streak_days?: number | null
          total_games?: number | null
          updated_at?: string
          user_id?: string
          username?: string | null
          wins?: number | null
        }
        Relationships: []
      }
      rating_history: {
        Row: {
          id: string
          rating_blitz: number | null
          rating_classical: number | null
          rating_rapid: number | null
          recorded_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          rating_blitz?: number | null
          rating_classical?: number | null
          rating_rapid?: number | null
          recorded_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          rating_blitz?: number | null
          rating_classical?: number | null
          rating_rapid?: number | null
          recorded_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rating_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rating_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string
          id: string
          metadata: Json | null
          result: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description: string
          id?: string
          metadata?: Json | null
          result?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string
          id?: string
          metadata?: Json | null
          result?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      profiles_public: {
        Row: {
          accuracy: number | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          draws: number | null
          id: string | null
          last_active_at: string | null
          losses: number | null
          puzzles_solved: number | null
          rating_blitz: number | null
          rating_classical: number | null
          rating_rapid: number | null
          streak_days: number | null
          total_games: number | null
          username: string | null
          wins: number | null
        }
        Insert: {
          accuracy?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          draws?: number | null
          id?: string | null
          last_active_at?: string | null
          losses?: number | null
          puzzles_solved?: number | null
          rating_blitz?: number | null
          rating_classical?: number | null
          rating_rapid?: number | null
          streak_days?: number | null
          total_games?: number | null
          username?: string | null
          wins?: number | null
        }
        Update: {
          accuracy?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          draws?: number | null
          id?: string | null
          last_active_at?: string | null
          losses?: number | null
          puzzles_solved?: number | null
          rating_blitz?: number | null
          rating_classical?: number | null
          rating_rapid?: number | null
          streak_days?: number | null
          total_games?: number | null
          username?: string | null
          wins?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_game_player: {
        Args: { game_row: Database["public"]["Tables"]["games"]["Row"] }
        Returns: boolean
      }
      remove_player_from_matchmaking: {
        Args: { p_player_id: string }
        Returns: undefined
      }
      update_game_ratings: {
        Args: { p_game_id: string; p_result: string; p_result_reason: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
