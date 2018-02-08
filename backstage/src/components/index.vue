<template>
	<div class="baseContainer">
		<el-row>
			<el-card class="box-card" v-if="hideTip">
				<div slot="header" class="clearfix">
					<span>系统使用介绍</span>
					<el-button style="float: right; padding: 3px 0" type="text" @click="hideTip = false">关闭</el-button>
				</div>
				<div v-for="o in 4" :key="o" class="text item">
					{{'列表内容 ' + o }}
				</div>
			</el-card>
		</el-row>
		<el-row>
			<div class="container">
				<h2 class="line">游戏信息</h2>
				<el-col :span="12">
					<span>名称:</span>
					<span>皇冠4D彩票</span>
				</el-col>
				<el-col :span="12" class="text-right">
					<span>当前期数:</span>
					<span>12344</span>
				</el-col>
			</div>
			
		</el-row>
		<el-row>
			<div class="container">
				<el-form :model="ruleForm" :inline="true" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
					<el-form-item label="时间" prop="time">
						<el-date-picker
							v-model="ruleForm.date"
							type="daterange"
							align="right"
							unlink-panels
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							:picker-options="pickerOptions2">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="" prop="time">
						<el-button type="primary" @click="search()">搜索</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-row>
		<el-row>
			<div class="container">
				<el-col :span="12">
					<h3>当前状态: <span>{{status}}</span> </h3>
				</el-col>
				<el-col :span="12" class="text-center">
					<el-button type="primary" @click="gameSetting">游戏设置</el-button>
					<el-button type="primary" @click="liveConf">直播开奖</el-button>
					<el-button type="primary" @click="showCustomize">自定义开奖</el-button>
				</el-col>
			</div>
		</el-row>
		<el-row>
			<div class="container">
				<el-table
					v-loading="loading"
					:data="tableData"
					stripe
					style="width: 100%">
					<el-table-column
						align="center"
						prop="period"
						label="期数">
					</el-table-column>
					<el-table-column
						align="center"
						prop="date"
						:formatter="formatDate"
						label="开奖时间">
					</el-table-column>
					<el-table-column
						align="center"
						prop="first"
						label="头奖">
					</el-table-column>
					<el-table-column
						align="center"
						prop="second"
						label="二奖">
					</el-table-column>
					<el-table-column
						align="center"
						prop="third"
						label="三奖">
					</el-table-column>
					<el-table-column
						align="center"
						width="450"
						prop="special"
						:formatter="formatNumber"
						label="特别奖">
					</el-table-column>
					<el-table-column
						align="center"
						width="450"
						prop="comfort"
						:formatter="formatNumber"
						label="安慰奖">
					</el-table-column>
					<el-table-column
						align="center"
						
						label="操作">
						<template slot-scope="scope">
							<el-button type="text" @click="detail(scope.row)">查看</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="container text-center">
					<el-pagination
						background
						layout="prev, pager, next"
						:total="total" :page-size="pageCount"
						@current-change="handleCurrentChange"
						:current-page.sync="currentPage">
					</el-pagination>
				</div>
				
			</div>
		</el-row>
		<el-dialog
			title="游戏设置"
			:visible.sync="settingVisible"
			width="30%">
			<h3>注意:实际效果以保存操作后为准，请刷新页面后查看最新系统状态信息</h3>
			<br>
			<el-form :model="settingForm" :rules="settingRules" ref="settingForm" label-width="100px" class="demo-settingForm">
				<el-form-item label="开奖模式" prop="type">
					<el-select v-model="settingForm.type" placeholder="请选择开奖模式">
						<el-option label="系统开奖" value="1"></el-option>
						<el-option label="自定义开奖" value="2"></el-option>
						<el-option label="直播开奖" value="3"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="开采状态" prop="status">
					<el-radio v-model="settingForm.status" label="1">开采</el-radio>
  					<el-radio v-model="settingForm.status" label="0">暂停</el-radio>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="settingVisible = false">取 消</el-button>
				<el-button type="primary" @click="confirmSetting" :loading="settingLoading">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog
			title="自定义开奖设置"
			:visible.sync="customizeDialog"
			width="60%">
			<el-form v-loading="customizeLoading" :model="customizeForm" :rules="customizes" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="期数" prop="period">
					<span>{{customizeForm.period}}</span>
				</el-form-item>
				<el-form-item label="首奖" prop="firstPrise.number">
					<h3 >{{customizeForm.firstPrise.number}}</h3>
				</el-form-item>
				<el-form-item label="二奖" prop="secondPrise.number">
					<h3 >{{customizeForm.secondPrise.number}}</h3>
				</el-form-item>
				<el-form-item label="三奖" prop="thirdPrise.number">
					<h3 >{{customizeForm.thirdPrise.number}}</h3>
				</el-form-item>
				<el-form-item label="特别奖">
					<div class="prizeContainer">
						<el-button type="text" v-for="(item,index) in customizeForm.speciallyPrise" :key="item._id" @click="showPopover(index,item.number)">{{(item.is1Selected || item.is2Selected || item.is3Selected)?"----":item.number}}</el-button>
						<el-button type="primary" v-if="customizeForm.speciallyPrise.length <= 12" @click="add('special')">添加</el-button>
					</div>
					<el-popover
						ref="popover5"
						placement="top"
						width="360"
						v-model="visible2">
						<p>请选择修改号码或者选择成为首/二/三奖</p>
						<div style="text-align: right; margin: 0">
							<el-button size="mini" type="text" @click="updatePop()">修改</el-button>
							<el-button type="primary" size="mini" @click="choosePop(1)">首奖</el-button>
							<el-button type="primary" size="mini" @click="choosePop(2)">二奖</el-button>
							<el-button type="primary" size="mini" @click="choosePop(3)">三奖</el-button>
						</div>
					</el-popover>
				</el-form-item>
				<el-form-item label="安慰奖">
					<div class="prizeContainer">
						<el-button type="text" v-for="(item,index) in customizeForm.comfortPrise" :key="item._id" @click="change('comfort',index,item.number)">{{item.number}}</el-button>
						<el-button type="primary" v-if="customizeForm.comfortPrise.length <= 9" @click="add('comfort')">添加</el-button>
					</div>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="customizeDialog = false">取 消</el-button>
				<el-button type="primary" @click="confirmCustomize">保 存</el-button>
			</span>
		</el-dialog>
		<el-dialog
			title="历史开奖详情"
			:visible.sync="detailDialog"
			width="60%">
			<el-form :model="tempForm"  ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="期数" prop="period">
					<span>{{tempForm.period}}</span>
				</el-form-item>
				<el-form-item label="首奖" prop="first">
					<h3 >{{tempForm.first}}</h3>
				</el-form-item>
				<el-form-item label="二奖" prop="second">
					<h3 >{{tempForm.second}}</h3>
				</el-form-item>
				<el-form-item label="三奖" prop="third">
					<h3 >{{tempForm.third}}</h3>
				</el-form-item>
				<el-form-item label="特别奖">
					<div class="prizeContainer">
						<el-button type="text" v-for="(item) in tempForm.special" :key="item._id">{{item}}</el-button>
					</div>
				</el-form-item>
				<el-form-item label="安慰奖">
					<div class="prizeContainer">
						<el-button type="text" v-for="(item) in tempForm.comfort" :key="item._id">{{item}}</el-button>
					</div>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="detailDialog = false">关闭</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
export default {
	data(){
		return {
			hideTip:true,
			ruleForm:{},
			rules:{},
			value7:"",
			pickerOptions2: {
				shortcuts: [{
					text: '最近一周',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
						picker.$emit('pick', [start, end]);
					}
				}, {
					text: '最近一个月',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
						picker.$emit('pick', [start, end]);
					}
				}, {
					text: '最近三个月',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
						picker.$emit('pick', [start, end]);
					}
				}]
			},
			currentPage:1,
			total:1,
			pageCount:10,
			loading:true,
			tableData: [],
			customizeDialog:false,
			customizeLoading:false,
			// 自定义
			customizeForm:{
				date:new Date().toLocaleDateString().replace("/","-"),
				firstPrise:{},
				secondPrise:{},
				thirdPrise:{},
				speciallyPrise:[],
				comfortPrise:[]
			},
			// 详情
			tempForm:{
				date:new Date().toLocaleDateString().replace("/","-"),
				firstPrise:{},
				secondPrise:{},
				thirdPrise:{},
				speciallyPrise:[],
				comfortPrise:[]
			},
			detailDialog:false,
			customizes:{},
			visible2:false,
			selected : {
				value:"",
				index:"",
			},
			// 系统配置
			settingVisible:false,
			gameSettingInfo:{},
			settingForm:{},
			settingLoading:false,
			settingRules:{

			},
		}
	},
	created(){
		this.$message.info("正在加载系统配置，请稍后");
		this.checkoutLogin();
		this.getConf();
		this.search();
	},
	computed:{
		status(){
			let status = {
				"0":"暂停开采",
				"1":"正在开采"
			}
			return status[this.settingForm.status] || "";
		}
	},
	methods:{
		// 格式化日期
		formatDate(row,col){
			return new Date(row.date).toLocaleDateString();
		},
		// 格式化数据
		formatNumber(row,col){
			return row[col.property].join(",");
		},
		// 加载数据
		search(page){
			let self = this;
			self.loading = true;
			let data = {
				pageId:1,
				pageCount:self.pageCount,
				startDate:new Date(new Date()-604800000).toLocaleDateString().replace(/\//g,"-"),
				endDate:new Date().toLocaleDateString().replace(/\//g,"-")
			};
			if(self.ruleForm.date && self.ruleForm.date.length != 0){
				data.startDate = new Date(self.ruleForm.date[0]).toLocaleDateString().replace(/\//g,"-")
				data.endDate = new Date(self.ruleForm.date[1]).toLocaleDateString().replace(/\//g,"-")
			}
			if(page){
				data.pageId = page.pageId
			}
			self.$axios.post(self.$interfaces.list,data).then((res)=>{
				self.loading = false;
				if(res.data.status == 200){
					self.tableData = res.data.data;
					self.currentPage = res.data.pageId;
					self.total = res.data.total;
				}
			});;
		},
		// 切换分页
		handleCurrentChange(value){
			this.search({pageId:value});
			
		},
		// 检测登录状态
		checkoutLogin(){
			let self = this;
			self.$axios.get(self.$interfaces.check).then(res=>{
				console.log(res.data);
				
			});
		},
		// 获取配置信息
		getConf(){
			let self = this;
			self.$axios.get(self.$interfaces.setting).then(res=>{
				if(res.data.status == 200){
					self.settingForm = res.data.data;
					self.$message({
						message:"加载成功",
						type:"success"
					});
				}else{
					self.$message({
						message:"系统设置加载失败，请确认服务是否正常",
						type:"error"
					});
				}
			});
		},
		getList(){
			let self = this;
			
		},
		// 游戏设置
		gameSetting(){
			let self = this;
			self.settingVisible = true;
		},
		// 提交游戏设置
		confirmSetting(){
			let self = this;
			self.settingLoading = true;
			let data = {
				type:self.settingForm.type,
				status:self.settingForm.status
			}
			self.$axios.post(self.$interfaces.update,data).then(res=>{
				self.settingLoading = false;
				self.settingVisible = false;
				if(res.data.status == 200){
					self.$message.success("修改成功");
					window.location.reload(true);
				}else{
					self.$message.error("修改失败");
				}
			});
		},
		// 直播设置
		liveConf(){
			let self = this;
			if(self.settingForm.type != 3){
				self.$message.error("当前系统设置非直播开奖模式，请先修改系统设置");
				return false;
			}
		},
		// 初始化period
		initPeriod(){
			let date = new Date();
					
			let month =  date.getMonth()>9?date.getMonth()+1:"0"+(date.getMonth()+1);
			let day = date.getDate()>9?date.getDate():"0"+date.getDate();

			return date.getFullYear()+ month + day;
		},
		// 获取自定义设置
		showCustomize(){
			let self = this;
			if(self.settingForm.type != 2){
				self.$message.error("当前系统设置非自定义开奖模式，请先修改系统设置");
				return false;
			}
			self.customizeDialog = true;
			self.customizeLoading = true;
			self.$axios.get(self.$interfaces.customizeGet).then(res=>{
				self.customizeLoading = false;
				if(res.data.status == 200){
					if(res.data.data == null){
						self.customizeForm = {
							date:self.initPeriod(),
							firstPrise:{},
							secondPrise:{},
							thirdPrise:{},
							speciallyPrise:[],
							comfortPrise:[]
						};
					}else{
						self.customizeForm = res.data.data;
						self.customizeForm.speciallyPrise[self.customizeForm.firstPrise.index].is1Selected = true;
						self.customizeForm.speciallyPrise[self.customizeForm.secondPrise.index].is2Selected = true;
						self.customizeForm.speciallyPrise[self.customizeForm.thirdPrise.index].is3Selected = true;
					}
					
					
				}else{
					self.$message({
						message:res.data.msg,
						type:"error"
					});
				}
			});
		},
		// 添加自定义号码
		add(type){
			let self = this;
			if(type == 'special'){
				if(self.customizeForm.speciallyPrise.length <= 13){
					self.customizeForm.speciallyPrise.push({number:'请点击输入',date:new Date(),is1Selected:false,is2Selected:false,is3Selected:false});
				}
			}else{
				if(self.customizeForm.comfortPrise.length <= 13){
					self.customizeForm.comfortPrise.push({number:'请点击输入',date:new Date()});
				}
			}
		},
		// 修改自定义号码
		change(type,index,obj){
			let self = this;
			this.$prompt('请输入号码', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputPattern: /^\d{4,4}$/,
				inputValue:obj=="请点击输入"?"":obj,
				inputErrorMessage: '号码格式不正确'
			}).then(({ value }) => {
				if(type == 'special'){
					self.customizeForm.speciallyPrise[index].number = value;
				}else{
					self.customizeForm.comfortPrise[index].number = value;
				}
				
			}).catch((error) => {
				console.log(error);
				
				this.$message({
					type: 'info',
					message: '取消输入'
				});       
			});
			
		},
		// 弹popover
		showPopover(index,value){
			let self= this;
			if(value == "请点击输入"){
				self.change("special",index,value);
			}else{
				self.selected.value = value;
				self.selected.index = index;
				self.visible2 = true;
			}
		},
		// pop修改
		updatePop(){
			let self = this;
			this.change("special",self.selected.index,self.selected.value);
		},
		// pop选择奖
		choosePop(val){
			let self = this;
			if(val == 1){
				self.customizeForm.firstPrise = {
					number:self.selected.value,
					date:new Date(),
					index:self.selected.index
				}
				for(let i = 0; i < self.customizeForm.speciallyPrise.length; i ++){
					self.customizeForm.speciallyPrise[i].is1Selected = false;
				}
				self.customizeForm.speciallyPrise[self.selected.index].is1Selected = true;
				self.visible2 = false;
			}else if(val == 2){
				self.customizeForm.secondPrise = {
					number:self.selected.value,
					date:new Date(),
					index:self.selected.index
				}
				for(let i = 0; i < self.customizeForm.speciallyPrise.length; i ++){
					self.customizeForm.speciallyPrise[i].is2Selected = false;
				}
				self.customizeForm.speciallyPrise[self.selected.index].is2Selected = true;
				self.visible2 = false;
			}else{
				self.customizeForm.thirdPrise = {
					number:self.selected.value,
					date:new Date(),
					index:self.selected.index
				}
				for(let i = 0; i < self.customizeForm.speciallyPrise.length; i ++){
					self.customizeForm.speciallyPrise[i].is3Selected = false;
				}
				self.customizeForm.speciallyPrise[self.selected.index].is3Selected = true;
				self.visible2 = false;
			}
		},
		// 验证自定义form
		validForm(){
			let self = this;
			for(let item in self.customizeForm){
				if(self.customizeForm[item] instanceof Array){
					for(let item2 in self.customizeForm[item]){
						if(self.customizeForm[item][item2].number == "请点击输入" || self.customizeForm[item][item2].number == ""){
							this.$alert(item+'的第'+item2+'个号码未设定！', '错误', {
								confirmButtonText: '确定',
							});
							return false;
						}
						
					}
				}
			}
			if(self.customizeForm.firstPrise.number == undefined || self.customizeForm.firstPrise.number == ""){
				this.$alert('首奖未设置', '错误', {
					confirmButtonText: '确定',
				});
				return false;
			}
			if(self.customizeForm.secondPrise.number == undefined || self.customizeForm.secondPrise.number == ""){
				this.$alert('二奖未设置', '错误', {
					confirmButtonText: '确定',
				});
				return false;
			}
			if(self.customizeForm.thirdPrise.number == undefined || self.customizeForm.thirdPrise.number == ""){
				this.$alert('三奖未设置', '错误', {
					confirmButtonText: '确定',
				});
				return false;
			}
			if(self.customizeForm.speciallyPrise.length != 13){
				this.$alert('speciallyPrise的数量不够', '错误', {
					confirmButtonText: '确定',
				});
				return false;
			}
			if(self.customizeForm.comfortPrise.length != 10){
				this.$alert('comfortPrise的数量不够', '错误', {
					confirmButtonText: '确定',
				});
				return false;
			}
			return true;
			
		},
		// 确认提交
		confirmCustomize(){
			let self = this;
			if(this.validForm()){
				
				let data = {
					date:new Date().toLocaleDateString().replace(/\//g,'-'),
					period:self.customizeForm.date,
					firstPrise:self.customizeForm.firstPrise,
					secondPrise:self.customizeForm.secondPrise,
					thirdPrise:self.customizeForm.thirdPrise,
					speciallyPrise:self.customizeForm.speciallyPrise,
					comfortPrise:self.customizeForm.comfortPrise,
				}
				console.log(data);
				self.$axios.post(self.$interfaces.customizeUpdate,data).then(res=>{
					self.customizeDialog = false;
					if(res.data.status == 200){
						self.$message.success("提交成功");
					}else if(res.data.status == 201){
						self.$message.success("请求成功，未做任何修改");
					}else{
						self.$message.error("提交失败");
					}
				});
				
			}else{
				this.$alert('表单校验未通过', '错误', {
					confirmButtonText: '确定',
				});
				
			}
		},
		// 详情
		detail(obj){
			this.tempForm = obj;
			this.detailDialog = true;
		},
	}
}
</script>