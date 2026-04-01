
def calculate_new_xp(current_xp: int, streak: int):
    # Bônus por precisão (0 a 100%) e multiplicador de ofensiva
    base_xp = 20
    multiplier = 1 + (streak * 0.05) # +5% por dia de streak
    earned = int(base_xp * multiplier)
    return current_xp + earned

def update_streak(current_streak: int):
    # Lógica simplificada: Se logou ontem, mantém. Se hoje, ignora. Se antes, quebra.
    # (Pode ser refinada com bibliotecas de data)
    return current_streak + 1