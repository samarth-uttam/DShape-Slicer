import random

def generate_object_transform(count):
    if count == 0:
        position = [10, 10, 10]

    else:
      position = [
    round(random.uniform(0, 40), 3),
    round(random.uniform(0, 20), 3),
    round(random.uniform(0, 10), 3)
]


    return {
        "position": position,
        "rotation": [0, 0, 0],
        "scale": [1, 1, 1]
    }


