import os

def combine_files(directory, output_file):
    """
    Combines text files from a specified directory into a single output file,
    excluding certain directories, file extensions, and specific filenames.
    """
    excluded_dirs = {'node_modules', '.git', 'migrations'}
    excluded_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.sqlite', '.sqlite3', '.log'}
    excluded_files = {'package.json', 'package-lock.json', 'yarn.lock', '.gitignore', '.npmrc'}

    with open(output_file, 'a', encoding='utf-8') as outfile:
        for root, dirs, files in os.walk(directory):
            dirs[:] = [d for d in dirs if d not in excluded_dirs]

            for file in files:
                if any(file.endswith(ext) for ext in excluded_extensions) or file in excluded_files:
                    continue

                file_path = os.path.join(root, file)
                outfile.write(f"\n\n{'='*20} {file_path} {'='*20}\n\n")
                try:
                    with open(file_path, 'r', encoding='utf-8') as infile:
                        content = infile.read()
                        outfile.write(content)
                except UnicodeDecodeError:
                    with open(file_path, 'r', encoding='latin-1') as infile:
                        content = infile.read()
                        outfile.write(content)

base_dir = os.path.dirname(os.path.abspath(__file__))
directories = [os.path.join(base_dir, 'client/src'), os.path.join(base_dir, 'server')]
output_file = os.path.join(base_dir, 'combined_project_files.txt')

with open(output_file, 'w', encoding='utf-8') as outfile:
    outfile.write('')

for directory in directories:
    combine_files(directory, output_file)
