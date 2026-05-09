from datetime import UTC, datetime, timedelta


def compute_score(correct_count: int, total_count: int) -> int:
    if total_count <= 0:
        return 0
    return int((correct_count / total_count) * 100)


def calculate_earned_xp(correct_count: int, total_count: int, streak: int) -> int:
    base_xp = 20
    score = compute_score(correct_count, total_count)
    accuracy_bonus = int(score * 0.4)
    streak_bonus = int(base_xp * min(streak, 14) * 0.05)
    return max(base_xp + accuracy_bonus + streak_bonus, 5)


def compute_next_review(
    *,
    was_correct: bool,
    repetitions: int,
    interval_days: int,
    easiness: int,
) -> tuple[int, int, int, datetime]:
    ease = max(130, easiness + (10 if was_correct else -20))
    if not was_correct:
        repetitions = 0
        interval_days = 1
    else:
        repetitions += 1
        if repetitions == 1:
            interval_days = 1
        elif repetitions == 2:
            interval_days = 3
        else:
            interval_days = max(int(interval_days * (ease / 100)), interval_days + 1)

    next_review_at = datetime.now(UTC) + timedelta(days=interval_days)
    return repetitions, interval_days, ease, next_review_at