<div>
    <!--步骤栏-->
    <div class="top-bar">
        <div class="box">第1步：新建作业 </div>
        <div class="arrow current"></div>

        <div class="box">第2步：作业编辑 </div>
        <div class="arrow current"></div>

        <div class="box current">第3步：作业预览 </div>
        <div class="arrow "></div>

        <div class="box ">第4步：生成作业</div>
    </div>
    <!--预览区域-->
    <div class="preview-area">
        <div class="page-Wrap" v-html="previewHtml">

        </div>
    </div>
    <loading-layer></loading-layer>
    <div class="preview-bar ">
        <div class="preview-btn back">返回修改</div>
        <div class="preview-btn generate">生成作业</div>
    </div>
</div>