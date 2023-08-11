import argparse
from llm_rs.convert import AutoConverter
from llm_rs import AutoQuantizer

def convert_and_quantize_model(base_model_path, export_directory):
    converted_model = AutoConverter.convert(base_model_path, export_directory)
    quantized_model = AutoQuantizer.quantize(converted_model)
    return quantized_model

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Convert and quantize a model.")
    parser.add_argument("base_model_path", type=str, help="Path to the base model directory.")
    parser.add_argument("export_directory", type=str, help="Path to the export directory.")

    args = parser.parse_args()

    quantized_model = convert_and_quantize_model(args.base_model_path, args.export_directory)
    print('finish')
