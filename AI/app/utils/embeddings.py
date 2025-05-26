import numpy as np
from typing import Union, List

def calculate_similarity(
    embedding1: Union[np.ndarray, List[float]],
    embedding2: Union[np.ndarray, List[float]]
) -> float:
    """
    Calculate cosine similarity between two embedding vectors
    
    Args:
        embedding1: First embedding vector
        embedding2: Second embedding vector
        
    Returns:
        Cosine similarity score (float between -1 and 1)
    """
    # Convert lists to numpy arrays if needed
    if isinstance(embedding1, list):
        embedding1 = np.array(embedding1)
    if isinstance(embedding2, list):
        embedding2 = np.array(embedding2)
    
    # Normalize vectors
    embedding1_norm = embedding1 / np.linalg.norm(embedding1)
    embedding2_norm = embedding2 / np.linalg.norm(embedding2)
    
    # Calculate cosine similarity
    similarity = np.dot(embedding1_norm, embedding2_norm)
    
    # Ensure the output is in valid range
    similarity = max(-1.0, min(1.0, similarity))
    
    return similarity