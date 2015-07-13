{% extends "layout/layout.swig" %}
{% block content %}
<div id="home">
    {%for post in collections.post %}
    
    <div class="post_short">
        <h1><a href="/post/{{post.link}}">{{post.title}}</a></h1>
        <article>
            {{post.short}}
        </article>
    </div>
    <div id="debug">
        {{post}}
    </div>
    {% endfor %}
</div>
{% endblock %}