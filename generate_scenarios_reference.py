#!/usr/bin/env python3
"""
Generate SCENARIOS_REFERENCE.md from the TypeScript life files.
This script reads all life scenario files and creates a comprehensive markdown reference.
"""

import re
import json

# Life files to process
LIFE_FILES = [
    ('data/lives/microorganism.ts', '🦠 Micro-organism', 0),
    ('data/lives/snake.ts', '🐍 Snake', 21),
    ('data/lives/dog.ts', '🐕 Dog', 40),
    ('data/lives/poorStudent.ts', '🎓 Poor Human Student', 60),
    ('data/lives/richHuman.ts', '💎 Rich Human', 80),
    ('data/lives/monk.ts', '🧘 Monk / Spiritual Guide', 95),
]

def extract_scenarios_from_ts(filepath):
    """Extract scenario data from TypeScript file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract life description
    desc_match = re.search(r"description:\s*'([^']+)'", content)
    description = desc_match.group(1) if desc_match else ""
    
    # Find all scenarios
    scenarios = []
    scenario_pattern = r'\{\s*id:\s*[\'"]([^\'"]+)[\'"]\s*,\s*title:\s*[\'"]([^\'"]+)[\'"]\s*,\s*description:\s*[\'"]([^\'"]+)[\'"]\s*,\s*miniGameType:\s*[\'"]([^\'"]+)[\'"]\s*,\s*choices:\s*\[(.*?)\]\s*,?\s*\}'
    
    for match in re.finditer(scenario_pattern, content, re.DOTALL):
        scenario_id, title, desc, minigame, choices_str = match.groups()
        
        # Extract choices
        choices = []
        choice_pattern = r'\{\s*text:\s*[\'"]([^\'"]+)[\'"]\s*,\s*intention:\s*[\'"]([^\'"]+)[\'"]\s*,\s*action:\s*[\'"]([^\'"]+)[\'"]\s*,\s*consequence:\s*[\'"]([^\'"]+)[\'"]\s*,\s*reflection:\s*[\'"]([^\'"]+)[\'"]\s*,\s*intentionScore:\s*(-?\d+)\s*,\s*actionScore:\s*(-?\d+)\s*,\s*consequenceScore:\s*(-?\d+)\s*,\s*attachmentScore:\s*(-?\d+)'
        
        for choice_match in re.finditer(choice_pattern, choices_str, re.DOTALL):
            text, intention, action, consequence, reflection, int_score, act_score, con_score, att_score = choice_match.groups()
            choices.append({
                'text': text.replace("\\'", "'"),
                'intention': intention.replace("\\'", "'"),
                'action': action.replace("\\'", "'"),
                'consequence': consequence.replace("\\'", "'"),
                'reflection': reflection.replace("\\'", "'"),
                'intentionScore': int(int_score),
                'actionScore': int(act_score),
                'consequenceScore': int(con_score),
                'attachmentScore': int(att_score)
            })
        
        scenarios.append({
            'id': scenario_id,
            'title': title.replace("\\'", "'"),
            'description': desc.replace("\\'", "'"),
            'miniGameType': minigame,
            'choices': choices
        })
    
    return description, scenarios

def generate_markdown():
    """Generate the complete markdown reference."""
    md = """# Karma Game - Complete Scenarios Reference

This document contains all current scenarios and choices for each life form in the game.

**Last Updated:** Current game version with all 6 lives

---

## How to Win
**Goal:** Complete the Monk life with 99+ karma to achieve enlightenment.  
**Path:** Reach Monk status (95+ karma), then excel in Monk scenarios to reach 99+ karma.

---

## Karma Calculation
- **Intention (35%):** Your motivation and intent
- **Action (25%):** What you actually do  
- **Consequence (25%):** The outcome of your actions
- **Attachment (15%):** Your level of detachment from outcomes
- **Mini-Game Bonus:** Success adds to consequence score

---

"""
    
    for filepath, life_name, threshold in LIFE_FILES:
        try:
            description, scenarios = extract_scenarios_from_ts(filepath)
            
            md += f"## {life_name}\n"
            md += f"**Karma Threshold:** {threshold}  \n"
            md += f"**Description:** {description}\n\n"
            
            for i, scenario in enumerate(scenarios, 1):
                md += f"### Scenario {i}: {scenario['title']}\n"
                md += f"**Description:** {scenario['description']}  \n"
                md += f"**Mini-game:** {scenario['miniGameType'].replace('-', ' ').title()}\n\n"
                
                if scenario['choices']:
                    md += "| Choice | Intention | Action | Consequence | Reflection | Int | Act | Con | Att |\n"
                    md += "|--------|-----------|--------|-------------|------------|-----|-----|-----|-----|\n"
                    
                    for choice in scenario['choices']:
                        md += f"| {choice['text']} | {choice['intention']} | {choice['action']} | {choice['consequence']} | {choice['reflection']} | {choice['intentionScore']} | {choice['actionScore']} | {choice['consequenceScore']} | {choice['attachmentScore']} |\n"
                    
                    md += "\n"
            
            md += "---\n\n"
            
        except Exception as e:
            print(f"Error processing {filepath}: {e}")
            continue
    
    return md

if __name__ == '__main__':
    markdown_content = generate_markdown()
    
    with open('SCENARIOS_REFERENCE.md', 'w', encoding='utf-8') as f:
        f.write(markdown_content)
    
    print("✅ SCENARIOS_REFERENCE.md has been generated successfully!")
    print(f"📄 Total length: {len(markdown_content)} characters")
