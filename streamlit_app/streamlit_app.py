from base64 import decode
import streamlit as st
import pandas as pd
import requests 
import json
import time
import re


def decode_json(content):
    return json.loads(content.decode("utf-8"))

def get_categories():
    r = requests.get('http://localhost:3000/get_category_list')
    print(type(r.content))
    category_names = [category["category_name"] for category in decode_json(r.content)['category_list']]
    category_description =  {category["category_name"]: category["category_description"] for category in decode_json(r.content)['category_list']}
    category_ids =   {category["category_name"]: category["_id"] for category in decode_json(r.content)['category_list']}
    return category_names, category_description, category_ids

def get_idea(category, category_ids):
    id = category_ids[category]
    pload = {"category_id":id}
    r = requests.get('http://localhost:3000/api/get_idea', json=pload)
    idea = decode_json(r.content)['idea']
    idea = idea[0].capitalize() + idea[1:len(idea)]
    return idea

def post_idea(category, category_ids, idea):
    id = category_ids[category]
    words = idea.lstrip().lower().split(' ')
    clean_words = [re.sub('\W+','', word ) for word in words]
    idea_string = ' '.join(clean_words)
    idea_string = idea_string.strip()
    pload = {'category_id':id, 'idea':idea_string}
    r = requests.post('http://localhost:3000/add_idea', json=pload)
    return r

st.title("💟 Date Idea Generator")
create_idea = "Get Idea"
col1, col2 = st.columns([3, 1]) 


with col2: 
    create_idea = st.radio("What do you want to do?", ['Get Idea', 'Add New Idea'])

with col1:
    if create_idea == "Get Idea":
        st.subheader("💕 Get a Date Idea")
        category_names, category_description, category_ids = get_categories()
        category = st.selectbox('Select preferred category:', category_names)
        st.write("✨ " + category_description[category] + " ✨")

        if st.button('🌸 Generate Idea 🌸'):
            st.header('💌 Your date idea is: ')
            st.markdown(f"<h3 style='text-align: center; color: pink;'>{get_idea(category, category_ids)}</h1>", unsafe_allow_html=True)
    else:
        st.subheader("🎠 Add a New Date Idea")
        category_names, category_description, category_ids = get_categories()
        category = st.selectbox('Select category to add to:', category_names)
        new_idea = st.text_input('Your new idea!', '', max_chars =250)
        st.write("Your new date idea is: "+new_idea)
        if st.button('🌺 Submit Idea 🌺'):
            response = post_idea(category, category_ids, new_idea)
            if response.status_code == 200:
                if response.content.decode("utf-8") == 'This idea is already in the database':
                    st.write("Sorry this idea is already in the database. Anything else on your mind? 🤔")
                else:
                    st.write("Thank you! 🎉 Someone will be happy to get your idea! ")
            else:
                st.write("Sorry something went wrong 😔")
