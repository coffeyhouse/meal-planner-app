import os

def combine_files(directory, output_file):
    excluded_dirs = {'node_modules', '.git', 'migrations'}
    excluded_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.sqlite', '.sqlite3', '.log'}
    excluded_files = {'package.json', 'package-lock.json', 'yarn.lock', '.gitignore', '.npmrc'}

    with open(output_file, 'a', encoding='utf-8') as outfile:  # Change 'w' to 'a' to append
        for root, dirs, files in os.walk(directory):
            # Exclude specified directories
            dirs[:] = [d for d in dirs if d not in excluded_dirs]

            for file in files:
                # Exclude files with specific extensions or specific filenames
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

# Specify the directories and output file
directories = ['C:/Code/.projects/meal-planner-app/client/src', 
               'C:/Code/.projects/meal-planner-app/server']
output_file = 'combined_project_files.txt'

# Ensure the output file is empty before starting
with open(output_file, 'w', encoding='utf-8') as outfile:
    outfile.write('')

# Combine files from the specified directories
for directory in directories:
    combine_files(directory, output_file)