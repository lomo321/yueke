<div :data-index="orderBy" class="edit-item animate-show">
    <div class="edit-row">
        <strong>第{{orderBy}}题</strong>
        <div class="inline">
            <span><i>*</i>题型</span>
            <select v-model="editingStem.qtypeInner" class="select" v-on:change="typeChange">
                <option value="null">选择题型</option>
                <option value="1">单选题</option>
                <option value="2">多选题</option>
                <option value="3">填空题</option>
                <option value="4">简答题</option>
            </select>
        </div>

        <div class="inline" v-if="editingStem.qtypeInner==1||editingStem.qtypeInner==2">
            <span><i>*</i>选项</span>
            <select v-model="editingStem.answerCount" class="select" v-on:change="change">
                <template v-for="item,key in selectionArr">
                    <option :value="key">{{item}}</option>
                </template>
            </select>
        </div>
    </div>

    <div class="edit-row">

        <span><i>*</i>难度</span>
        <div v-if="editingStem.difficulty==0.8" class="difficulty" v-on:click="difficultyClick">
            <div class="selected" data-difficulty="0.8">基础</div>
            <div data-difficulty="0.5">巩固</div>
            <div data-difficulty="0.3">提高</div>
        </div>
        <div v-else-if="editingStem.difficulty==0.5" class="difficulty" v-on:click="difficultyClick">
            <div data-difficulty="0.8">基础</div>
            <div class="selected" data-difficulty="0.5">巩固</div>
            <div data-difficulty="0.3">提高</div>
        </div>
        <div v-else-if="editingStem.difficulty==0.3" class="difficulty" v-on:click="difficultyClick">
            <div data-difficulty="0.8">基础</div>
            <div data-difficulty="0.5">巩固</div>
            <div class="selected" data-difficulty="0.3">提高</div>
        </div>
        <div v-else class="difficulty" v-on:click="difficultyClick">
            <div data-difficulty="0.8">基础</div>
            <div data-difficulty="0.5">巩固</div>
            <div data-difficulty="0.3">提高</div>
        </div>

    <template v-if="isShowMarks">
        <span><i>&nbsp</i>分值</span>
        <input class="input" type="text" v-model="editingStem.score" v-on:change="change">
    </template>
    </div>
    <div class="edit-row">
        <span><i>*</i>知识点</span>
        <div class="knowledge">
            <div class="wrap">
                <template v-for="(item,index) in editingStem.knpList" >
                    <div class="item" >{{item.knpName}}<img style="float: right;" src="/images/delete.png" alt="" v-on:click="deleteKnp(index)"></div>
                </template>
                <div v-on:click="knpEdit" class="item add">
                    <img  src="/images/add.png" alt="" >
                </div>
            </div>
        </div>
    </div>
    <div class="edit-row">
        <span><i v-if="editingStem.qtypeInner == 1 || editingStem.qtypeInner == 2">*</i>答案</span>
        <template v-if="editingStem.qtypeInner == 1 || editingStem.qtypeInner == 2">
        <div class="answer answer-tag" v-on:click="answerClick">
            <template v-for="selection in editingStem.answerCountArray">
                <div  v-if="editingStem.answer.indexOf(selection)!=-1" class="answer-item selected">{{selection}}</div>
                <div  v-if="editingStem.answer.indexOf(selection) == -1" class="answer-item">{{selection}}</div>
            </template>
        </div>
        </template>
        <template v-if="editingStem.qtypeInner != 1 && editingStem.qtypeInner != 2">
            <span class="short-answer" v-if="editingStem.answer">{{editingStem.answer | textlize}}</span>
            <span v-else class="add-answer" v-on:click="edit"><img src="/images/add2.png" alt=""> 添加答案 </span>
            <!--<span class="short-answer" v-if="!editingStem.answer">{{editingStem.answer | textlize}}</span>-->
        </template>
        <div class="edit-link" v-on:click="edit">
            【编辑题目】
        </div>
    </div>
</div>
