import os
import re

def FindMembersOfAServer(servers, target_server):
    members_file_to_compare = set()
    with open(target_server, 'r') as comparison_file:
        content = comparison_file.read()
        members_file_to_compare = set(re.findall(r'\d+', content))
    for filename in os.listdir(servers):
        file_path = os.path.join(servers, filename)
        if os.path.isfile(file_path):
            members_current_file = set()
            with open(file_path, 'r') as current_file:
                content = current_file.read()
                members_current_file = set(re.findall(r'\d+', content))
            common_members = members_file_to_compare.intersection(members_current_file)
            if common_members:
                print(f"Common suspicious members found in {filename}:")
                for num in common_members:
                    print(f"  {num}")
            else:
                print(f"No common suspicious members found in {filename}. From the {target_server}")

directory_path = 'List Of Suspicious Servers'
file_to_compare = 'TargetExample.txt'
FindMembersOfAServer(directory_path, file_to_compare)