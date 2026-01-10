# app/core/ctgan_trainer.py
from sdv.single_table import CTGANSynthesizer
from sdv.metadata import SingleTableMetadata
from app.core.training_status import TRAINING_STATUS

def train_ctgan(df, epochs=30, batch_size=128):
    metadata = SingleTableMetadata()
    metadata.detect_from_dataframe(df)

    ctgan = CTGANSynthesizer(
        metadata=metadata,
        epochs=1,              # 🚨 ONE epoch per fit
        batch_size=batch_size,
        generator_lr=2e-4,
        discriminator_lr=2e-4,
        pac=1,
        verbose=False
    )

    TRAINING_STATUS["total_epochs"] = epochs

    for epoch in range(1, epochs + 1):
        TRAINING_STATUS.update({
            "state": "running",
            "epoch": epoch,
            "progress": int((epoch / epochs) * 100),
            "message": f"Training epoch {epoch}/{epochs}"
        })

        ctgan.fit(df)   # trains ONE epoch

    TRAINING_STATUS.update({
        "state": "completed",
        "progress": 100,
        "message": "Training completed"
    })

    return ctgan


# from sdv.single_table import CTGANSynthesizer
# from sdv.metadata import SingleTableMetadata

# def train_ctgan(df, epochs=30, batch_size=128):
#     MAX_ROWS = 10000
#     if len(df) > MAX_ROWS:
#         df = df.sample(MAX_ROWS, random_state=42)

#     metadata = SingleTableMetadata()
#     metadata.detect_from_dataframe(data=df)

#     ctgan = CTGANSynthesizer(
#         metadata=metadata,
#         epochs=epochs,
#         batch_size=batch_size,
#         generator_lr=2e-4,
#         discriminator_lr=2e-4,
#         pac=1,
#         verbose=True
#     )

#     # 🚨 NO STATUS UPDATES HERE
#     ctgan.fit(df)

#     return ctgan